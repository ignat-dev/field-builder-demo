"use client"

import { FIELD_BUILDER_STATE_KEY, MAX_CHOICE_LENGTH, MAX_CHOICES_COUNT } from "@/common/constants"
import { Alert, Button, Card, Form, Label , Prompt, SelectList} from "@/components/ui"
import { getField, saveField } from "@/lib/api"
import { storage } from "@/lib/storage"
import { validateFieldData } from "@/lib/validation"
import type { FieldData, ValidationError } from "@/types"
import { useCallback, useEffect, useMemo, useState } from "react"

import "./FieldBuilder.scss"

export default function FieldBuilder() {
  const orderOptions = [
    { value: "original", label: "Display choices in original order" },
    { value: "alphabetical", label: "Display choices in Alphabetical" },
  ]

  const fieldId = "123" // Using a hardcoded ID for demo purposes.
  const storageKey = `${FIELD_BUILDER_STATE_KEY}:${fieldId}`

  const [choices, setChoices] = useState<Array<string>>([])
  const [defaultValue, setDefaultValue] = useState<string>("")
  const [label, setLabel] = useState<string>("")
  const [order, setOrder] = useState<typeof orderOptions[number]["value"]>("original")
  const [required, setRequired] = useState<boolean>(false)

  const [alertInfo, setAlertInfo] = useState<{ text: string; title: string } | null>(null)
  const [errors, setErrors] = useState<Array<ValidationError>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [selectedChoice, setSelectedChoice] = useState<string>("")
  const errorFields = useMemo(() => new Set(errors.map(x => x.field)), [errors])
  const errorMessages = useMemo(() => errors.map(x => x.message), [errors])
  const isAlertOpen = useMemo(() => alertInfo !== null, [alertInfo])
  const maxChoicesLimitReached = useMemo(() => choices.length >= MAX_CHOICES_COUNT, [choices.length])

  const getOrderedList = useCallback((list: Array<string>, listOrder: string): Array<string> => {
    return (listOrder === "alphabetical") ? [...list].sort((x, y) => x.localeCompare(y)) : list
  }, [])

  useEffect(() => {
    Promise.all([
      Promise.resolve(storage.get<FieldData>(storageKey)),
      getField(fieldId),
    ])
      .then((results) => (
        results.filter((x) => x !== null).sort((x, y) => (y.timestamp ?? 0) - (x.timestamp ?? 0))
      ))
      .then(([data]) => {
        if (data) {
          const order = data.displayAlpha ? "alphabetical" : "original"

          setLabel(data.label ?? "")
          setRequired(data.required ?? false)
          setDefaultValue(data.default ?? "")
          setChoices(getOrderedList(data.choices ?? [], order))
          setOrder(order)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [getOrderedList, storageKey])

  return (
    <div className="field-builder">
      {isLoading && (
        <div className="field-builder__overlay">
          <span className="spinner-border text-primary" />
          <span>Loading, please wait...</span>
        </div>
      )}
      <Card className="form-wrapper" errors={errorMessages} title="Field Builder">
        <Form contentClassName="field-builder__content" disabled={isSaving} onSubmit={handleSubmit}>
          <Label accessKey="l" target="inputLabel" text="Label" />
          <div className="form__field">
            <input
              className={`form-control ${errorFields.has("label") ? "is-invalid" : ""}`}
              id="inputLabel"
              name="label"
              value={label}
              onChange={onChangeLabel}
            />
          </div>

          <label>Type</label>
          <div className="form__field">
            <span>Multi-select</span>
            <div className="form-check">
              <input
                className="form-check-input"
                checked={required}
                id="inputType"
                name="required"
                type="checkbox"
                onChange={onChangeRequired}
              />
              <Label className="form-check-label" accessKey="r" target="inputType" text="A Value is required" />
            </div>
          </div>

          <Label accessKey="v" target="inputDefaultValue" text="Default Value" />
          <div className="form__field">
            <input
              className={`form-control ${errorFields.has("default") ? "is-invalid" : ""}`}
              id="inputDefaultValue"
              name="default"
              value={defaultValue}
              onChange={onChangeDefaultValue}
            />
          </div>

          <Label accessKey="h" target="selectChoices" text="Choices" />
          <div className="form__field form__field--vertical">
            <SelectList
              className={`${errorFields.has("choices") ? "is-invalid" : ""}`}
              id="selectChoices"
              label="Choices"
              name="choices"
              items={choices}
              selectedItem={selectedChoice}
              size={6}
              onSelect={onChangeSelectedChoice}
            />
            <div className="form__field-actions">
              <Button
                accessKey="a"
                appearance="outline"
                data-testid="buttonAddChoice"
                disabled={maxChoicesLimitReached}
                size="small"
                text="Add"
                tooltip={!maxChoicesLimitReached ? "Add a new choice to the list" : "Maximum choices limit reached"}
                variant="light"
                onClick={onAddChoice}
              />
              <Button
                accessKey="m"
                appearance="outline"
                data-testid="buttonRemoveChoice"
                disabled={!selectedChoice}
                size="small"
                text="Remove"
                tooltip={selectedChoice ? "Remove the selected choice from the list" : "Select a choice to remove"}
                variant="light"
                onClick={onRemoveChoice}
              />
            </div>
          </div>

          <Label accessKey="o" target="selectOrder" text="Order" />
          <div className="form__field">
            <select className="form-select" id="selectOrder" name="order" value={order} onChange={onChangeOrder}>
              {orderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form__actions">
            <Button
              accessKey="s"
              loading={isSaving}
              text={isSaving ? "Saving..." : "Save changes"}
              type="submit"
              variant="success"
            />
            {" Or "}
            <Button
              accessKey="n"
              appearance="link"
              disabled={isSaving}
              text="Cancel"
              variant="danger"
              onClick={handleClear}
            />
          </div>
        </Form>
      </Card>
      <Alert {...alertInfo} open={isAlertOpen} onClose={onCloseAlert} />
      <Prompt
        open={isPromptOpen}
        title="Add a choice"
        maxLength={MAX_CHOICE_LENGTH}
        placeholder="Enter choice value"
        onClose={onClosePrompt}
      />
    </div>
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let choicesList = choices

    if (defaultValue && !choicesList.includes(defaultValue)) {
      choicesList = updateChoicesList([defaultValue, ...choicesList])
      setSelectedChoice(defaultValue)
    }

    const data: FieldData = {
      label,
      type: "multi-select",
      required,
      default: defaultValue,
      choices: choicesList,
      displayAlpha: order === "alphabetical",
      timestamp: Date.now()
    }

    const { errors } = validateFieldData(data)

    if (errors.length > 0) {
      return setErrors(errors)
    } else {
      setErrors([])
    }


    try {
      setIsSaving(true)
      await saveField(data)
    } catch (ex) {
      console.error("An unexpected error occurred while saving the field data.", ex)
    } finally {
      setIsSaving(false)
    }
  }

  function handleClear() {
    setLabel("")
    setRequired(false)
    setDefaultValue("")
    setChoices([])
    setOrder("original")
    storage.remove(storageKey)
  }

  function onChangeLabel(e: React.ChangeEvent<HTMLInputElement>) {
    setLabel(e.target.value)
    saveFormState({ label: e.target.value })
  }

  function onChangeRequired(e: React.ChangeEvent<HTMLInputElement>) {
    setRequired(e.target.checked)
    saveFormState({ required: e.target.checked })
  }

  function onChangeDefaultValue(e: React.ChangeEvent<HTMLInputElement>) {
    setDefaultValue(e.target.value)
    saveFormState({ default: e.target.value })
  }

  function onChangeSelectedChoice(value: string) {
    setSelectedChoice(value)
  }

  function onChangeOrder(e: React.ChangeEvent<HTMLSelectElement>) {
    const prevOrder = order
    const nextOrder = e.target.value as typeof orderOptions[number]["value"]

    setOrder(nextOrder)
    saveFormState({ displayAlpha: nextOrder === "alphabetical" })

    if (prevOrder === "original" && nextOrder === "alphabetical") {
      updateChoicesList(choices, nextOrder)
    }
  }

  function onAddChoice() {
    setIsPromptOpen(true)
  }

  function onRemoveChoice() {
    if (selectedChoice) {
      const currentIndex = choices.indexOf(selectedChoice)
      const updated = choices.filter(c => c !== selectedChoice)
      const nextIndex = currentIndex < updated.length ? currentIndex : Math.max(0, updated.length - 1)

      setChoices(updated)
      setSelectedChoice(updated[nextIndex] || "")
      saveFormState({ choices: updated })
    }
  }

  function onClosePrompt(text?: string) {
    setIsPromptOpen(false)

    if (text) {
      const lowerText = text.toLocaleLowerCase()
      const duplicate = choices.find((x) => x.toLocaleLowerCase() === lowerText)

      if (!duplicate) {
        updateChoicesList([...choices, text])
        setSelectedChoice(text)
      } else {
        setAlertInfo({
          title: "Choice already exists",
          text: `A choice "${duplicate}" already exists, please enter a different value.`,
        })
      }
    }
  }

  function onCloseAlert() {
    setAlertInfo(null)
  }

  function updateChoicesList(list: Array<string>, listOrder?: string): Array<string> {
    const result = getOrderedList(list, listOrder ?? order)

    setChoices(result)
    saveFormState({ choices: result })

    if (selectedChoice && !result.includes(selectedChoice)) {
      setSelectedChoice("")
    }

    return result
  }

  function saveFormState(state: Partial<FieldData>) {
    storage.set<FieldData>(storageKey, {
      label,
      type: "multi-select",
      required,
      default: defaultValue,
      choices,
      displayAlpha: order === "alphabetical",
      ...state,
      timestamp: Date.now(),
    })
  }
}
