"use client"

import { MAX_CHOICES_COUNT } from "@/common/constants"
import { getField, saveField } from "@/lib/api"
import { validateFieldData } from "@/lib/validation"
import type { FieldData, ValidationError } from "@/types"
import { useCallback, useEffect, useMemo, useState } from "react"

import "./FieldBuilder.scss"

export default function FieldBuilder() {
  const orderOptions = [
    { value: "original", label: "Display choices in original order" },
    { value: "alphabetical", label: "Display choices in Alphabetical" },
  ]

  const [choices, setChoices] = useState<Array<string>>([])
  const [defaultValue, setDefaultValue] = useState<string>("")
  const [label, setLabel] = useState<string>("")
  const [order, setOrder] = useState<typeof orderOptions[number]["value"]>("original")
  const [required, setRequired] = useState<boolean>(false)

  const [errors, setErrors] = useState<Array<ValidationError>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [selectedChoice, setSelectedChoice] = useState<string>("")
  const errorFields = useMemo(() => new Set(errors.map(e => e.field)), [errors])
  const maxChoicesLimitReached = useMemo(() => choices.length >= MAX_CHOICES_COUNT, [choices.length])

  const getOrderedList = useCallback((list: Array<string>, listOrder: string): Array<string> => {
    return (listOrder === "alphabetical") ? [...list].sort((x, y) => x.localeCompare(y)) : list
  }, [])

  useEffect(() => {
    getField("123").then(fieldData => {
      const order = fieldData.displayAlpha ? "alphabetical" : "original"

      setLabel(fieldData.label ?? "")
      setRequired(fieldData.required ?? false)
      setDefaultValue(fieldData.default ?? "")
      setChoices(getOrderedList(fieldData.choices ?? [], order))
      setOrder(order)
    }).finally(() => setIsLoading(false))
  }, [getOrderedList])

  return (
    <div className="field-builder">
      {isLoading && (
        <div className="field-builder__overlay">
          <span className="spinner-border text-primary" />
          <span>Loading, please wait...</span>
        </div>
      )}
      <div className="card form-wrapper">
        <div className="card-header">
          Field Builder
        </div>
        {errors.length > 0 && (
          <div className="card-notification type-danger">
            <p>Please correct the following errors and try again:</p>
            <ul>{errors.map((error, index) => <li key={index}>{error.message}</li>)}</ul>
          </div>
        )}
        <div className="card-body">
          <form onSubmit={handleSubmit}>
          <fieldset disabled={isSaving}>
            <label htmlFor="inputLabel">Label</label>
            <div className="form__field">
              <input
                className={`form-control${errorFields.has("label") ? " is-invalid" : ""}`}
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
                <label className="form-check-label" htmlFor="inputType">
                  A Value is required
                </label>
              </div>
            </div>

            <label htmlFor="inputDefaultValue">Default Value</label>
            <div className="form__field">
              <input
                className={`form-control${errorFields.has("default") ? " is-invalid" : ""}`}
                id="inputDefaultValue"
                name="default"
                value={defaultValue}
                onChange={onChangeDefaultValue}
              />
            </div>

            <label htmlFor="selectChoices">Choices</label>
            <div className="form__field form__field--vertical">
              <select
                className={`form-select${errorFields.has("choices") ? " is-invalid" : ""}`}
                id="selectChoices"
                name="choices"
                size={6}
                value={selectedChoice}
                onInput={onChangeSelectedChoice}
              >
                {choices.length === 0 ? (
                  <option disabled={true}>&nbsp;</option>
                ) : (
                  choices.map((x) => (
                    <option key={x} value={x}>{x}</option>
                  ))
                )}
              </select>
              <div className="form__field-actions">
                <span title={!maxChoicesLimitReached ? "Add a new choice to the list" : "Maximum choices limit reached"}>
                  <button
                    className="btn btn-outline-light btn-sm"
                    disabled={maxChoicesLimitReached}
                    type="button"
                    onClick={onAddChoice}
                  >
                    Add
                  </button>
                </span>
                <span title={selectedChoice ? "Remove the selected choice from the list" : "Select a choice to remove"}>
                  <button
                    className="btn btn-outline-light btn-sm"
                    disabled={!selectedChoice}
                    type="button"
                    onClick={onRemoveChoice}
                  >
                    Remove
                  </button>
                </span>
              </div>
            </div>

            <label htmlFor="selectOrder">Order</label>
            <div className="form__field">
              <select className="form-select" id="selectOrder" value={order} onChange={onChangeOrder}>
                {orderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__actions">
              <button className="btn btn-success" disabled={isSaving} type="submit">
                <span className={isSaving ? "spinner-border spinner-border-sm" : ""} />
                <span>{isSaving ? "Saving..." : "Save changes"}</span>
              </button>
              {" Or "}
              <button className="btn btn-danger btn-link" disabled={isSaving} type="button" onClick={handleClear}>
                Cancel
              </button>
            </div>
          </fieldset>
          </form>
        </div>
      </div>
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
    }

    const { errors } = validateFieldData(data)

    if (errors.length > 0) {
      return setErrors(errors)
    } else {
      setErrors([])
    }

    console.log("Submitting form data..", data)

    try {
      setIsSaving(true)
      await saveField(data)
      console.log("Field data saved successfully.")
    } catch (ex) {
      console.error("An unexpected error occurred while saving the field data.", ex)
    } finally {
      setIsSaving(false)
    }
  }

  function handleClear() {
    console.log("Clearing form data..")
    setLabel("")
    setRequired(false)
    setDefaultValue("")
    setChoices([])
    setOrder("original")
  }

  function onChangeLabel(e: React.ChangeEvent<HTMLInputElement>) {
    setLabel(e.target.value)
  }

  function onChangeRequired(e: React.ChangeEvent<HTMLInputElement>) {
    setRequired(e.target.checked)
  }

  function onChangeDefaultValue(e: React.ChangeEvent<HTMLInputElement>) {
    setDefaultValue(e.target.value)
  }

  function onChangeSelectedChoice(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedChoice(e.target.value)
  }

  function onChangeOrder(e: React.ChangeEvent<HTMLSelectElement>) {
    const prevOrder = order
    const nextOrder = e.target.value as typeof orderOptions[number]["value"]

    setOrder(nextOrder)

    if (prevOrder === "original" && nextOrder === "alphabetical") {
      updateChoicesList(choices, nextOrder)
    }
  }

  function onAddChoice() {
    const choice = prompt("Enter choice name:")

    if (choice) {
      if (!choices.includes(choice)) {
        updateChoicesList([...choices, choice])
        setSelectedChoice(choice)
      } else {
        alert(`A choice "${choice}" already exists, please enter a different name.`)
      }
    }
  }

  function onRemoveChoice() {
    if (selectedChoice) {
      const currentIndex = choices.indexOf(selectedChoice)
      const updated = choices.filter(c => c !== selectedChoice)
      const nextIndex = currentIndex < updated.length ? currentIndex : Math.max(0, updated.length - 1)

      setChoices(updated)
      setSelectedChoice(updated[nextIndex] || "")
    }
  }

  function updateChoicesList(list: Array<string>, listOrder?: string): Array<string> {
    setChoices(getOrderedList(list, listOrder ?? order))

    if (selectedChoice && !list.includes(selectedChoice)) {
      setSelectedChoice("")
    }

    return list
  }
}
