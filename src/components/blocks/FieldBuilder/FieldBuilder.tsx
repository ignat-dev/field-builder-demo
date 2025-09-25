"use client"

import { MAX_CHOICES_COUNT } from "@/common/constants"
import type { FieldData } from "@/types"
import { useMemo, useState } from "react"

import "./FieldBuilder.scss"

export default function FieldBuilder() {
  const [choices, setChoices] = useState(["Asia", "Australia", "Europe", "Americas", "Africa"])
  const [defaultValue, setDefaultValue] = useState("Asia")
  const [label, setLabel] = useState("Sales Region")
  const [order, setOrder] = useState("alphabetical")
  const [required, setRequired] = useState(true)

  const [selectedChoice, setSelectedChoice] = useState("")
  const maxChoicesLimitReached = useMemo(() => choices.length >= MAX_CHOICES_COUNT, [choices.length])

  return (
    <div className="field-builder">
      <div className="card card--form-wrapper">
        <div className="card-header">
          Field Builder
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label htmlFor="inputLabel">Label</label>
            <div className="form__field">
              <input
                className="form-control"
                id="inputLabel"
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
                className="form-control"
                id="inputDefaultValue"
                value={defaultValue}
                onChange={onChangeDefaultValue}
              />
            </div>

            <label htmlFor="selectChoices">Choices</label>
            <div className="form__field form__field--vertical">
              <select
                className="form-select"
                id="selectChoices"
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
                <option value="original">Display choices in original order</option>
                <option value="alphabetical">Display choices in Alphabetical</option>
              </select>
            </div>

            <div className="form__actions">
              <button className="btn btn-success" type="submit">
                Save changes
              </button>
              {" Or "}
              <button className="btn btn-danger btn-link" type="button" onClick={handleClear}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let choicesList = choices

    if (defaultValue && !choicesList.includes(defaultValue)) {
      choicesList = [defaultValue, ...choicesList]
      setChoices(choicesList)
    }

    const data: Omit<FieldData, "id"> = {
      label,
      type: "multi-select",
      required,
      default: defaultValue,
      choices: choicesList,
      displayAlpha: order === "alphabetical",
    }

    console.log("Submitting form data..", data)
  }

  function handleClear() {
    console.log("Clearing form data..")
    setLabel("")
    setRequired(false)
    setDefaultValue("")
    setChoices([])
    setOrder("")
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
    setOrder(e.target.value)
  }

  function onAddChoice() {
    const choice = prompt("Enter choice name:")

    if (choice) {
      if (!choices.includes(choice)) {
        setChoices([...choices, choice])
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
}
