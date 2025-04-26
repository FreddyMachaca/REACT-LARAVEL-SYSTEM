import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";

const weekDays = [
  { label: "LUNES", value: "monday" },
  { label: "MARTES", value: "tuesday" },
  { label: "MIÉRCOLES", value: "wednesday" },
  { label: "JUEVES", value: "thursday" },
  { label: "VIERNES", value: "friday" },
  { label: "SÁBADO", value: "saturday" },
  { label: "DOMINGO", value: "sunday" },
];

function DialogSchedule({visible,  setVisible,  setScheduleValues,  scheduleValues,  handleAccept,  checkedDays, setEditingScheduleValues, editingScheduleValues}) {
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const toggleWorkDay = (day) => {
    setSelectedDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };

  // const handleScheduleChange = (field, value) => {
  //   setScheduleValues((prevState) => ({
  //     ...prevState,
  //     [field]: value,
  //   }));
  // };
  const handleScheduleChange = (field, value) => {
    setEditingScheduleValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  return (
    <Dialog
      header={
        <div style={{ textAlign: "center", padding: "10px" }}>
          DATOS HORARIO
        </div>
      }
      visible={visible}
      style={{ width: "55vw" }}
      onHide={() => setVisible(false)}
      className="p-fluid"
      footer={
        <div className="justify-center space-x-4">
          <Button
            label="ACEPTAR"
            icon="pi pi-check"
            className="p-button-success"
            onClick={() => handleAccept(selectedDays)}
          />
          <Button
            label="CANCELAR"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={() => setVisible(false)}
          />
        </div>
      }
    >
      <div className="mb-4 pt-2">
        <div className="grid gap-4 mb-4 col-offset-3">
          <div>
            <label htmlFor="ingress1" className="block mb-1 font-medium">
              INGRESO 1
            </label>
            <Calendar
              id="ingress1"
              timeOnly
              showIcon
              value={editingScheduleValues.ingress1}
              onChange={(e) => handleScheduleChange("ingress1", e.value)}
            />
          </div>
          <div>
            <label htmlFor="exit1" className="block mb-1 font-medium">
              SALIDA 1
            </label>
            <Calendar
              id="exit1"
              timeOnly
              showIcon
              value={editingScheduleValues.exit1}
              onChange={(e) => handleScheduleChange("exit1", e.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 mb-4 col-offset-3">
          <div>
            <label htmlFor="ingress2" className="block mb-1 font-medium">
              INGRESO 2
            </label>
            <Calendar
              id="ingress2"
              timeOnly
              showIcon
              value={editingScheduleValues.ingress2}
              onChange={(e) => handleScheduleChange("ingress2", e.value)}
            />
          </div>
          <div>
            <label htmlFor="exit2" className="block mb-1 font-medium">
              SALIDA 2
            </label>
            <Calendar
              id="exit2"
              timeOnly
              showIcon
              value={editingScheduleValues.exit2}
              onChange={(e) => handleScheduleChange("exit2", e.value)}
            />
          </div>
        </div>
      </div>

      {Object.keys(checkedDays).length == 0 && (
        <div className="mb-4">
          <div className="flex justify-content-center gap-4 mb-4">
            {weekDays.map((day) => (
              <div key={day.value} className="flex items-center">
                <Checkbox
                  inputId={day.value}
                  checked={selectedDays[day.value]}
                  onChange={() => toggleWorkDay(day.value)}
                />
                <label htmlFor={day.value} className="ml-2">
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </Dialog>
  );
}

export default DialogSchedule;
