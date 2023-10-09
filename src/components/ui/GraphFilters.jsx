import React, { useState } from 'react';
import "./graphFilters.css";

const GraphFilters = ({ setFilterValues, filterCardIsOpen, setFilterCardIsOpen }) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const defaultDate = `${year}-${month}-${day}`;

    const [filterCardValues, setFilterCardValues] = useState({
        selectedDate: defaultDate,
        selectedTime: ''
    });

    const { selectedDate, selectedTime } = filterCardValues;

    const handleChange = name => e => {
        setFilterCardValues({ ...filterCardValues, [name]: e.target.value });
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        if (selectedDate === '') {
            alert("Please select a date");
            return;
        }
        if (selectedTime === '') {
            alert("Please select a time");
            return;
        }

        const periodFrom = `${selectedDate} ${selectedTime}:01`;
        const periodTo = `${selectedDate} ${selectedTime === '23' ? '23:59:59' : `${parseInt(selectedTime) + 1}`.padStart(2, '0')}:00:00`;

        setFilterValues({ periodFrom, periodTo });
        setFilterCardIsOpen(!filterCardIsOpen);
    };

    const handleClearFilters = (e) => {
        setFilterCardValues({
            selectedDate: defaultDate,
            selectedTime: ''
        });
        setFilterCardIsOpen(!filterCardIsOpen);
    };

    const renderTimeOptions = () => {
        const timeOptions = [];
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        for (let i = 0; i < currentHour; i++) {
            const time = `${i}`.padStart(2, '0');
            timeOptions.push(
                <label key={time}>
                    <input
                        type="radio"
                        name="time"
                        value={time}
                        checked={selectedTime === time}
                        onChange={handleChange("selectedTime")}
                    />
                    {`${time}:00-${time === '23' ? '00' : `${parseInt(time) + 1}`.padStart(2, '0')}:00`}
                </label>
            );
        }

        // Check if the selected date is today and restrict the time options accordingly
        if (selectedDate === defaultDate) {
            const currentSelectedHour = parseInt(selectedTime);

            for (let i = currentHour; i > currentSelectedHour; i--) {
                const time = `${i}`.padStart(2, '0');
                timeOptions.push(
                    <label key={time}>
                        <input
                            type="radio"
                            name="time"
                            value={time}
                            checked={selectedTime === time}
                            onChange={handleChange("selectedTime")}
                        />
                        {`${time}:00-${time === '23' ? '00' : `${parseInt(time) + 1}`.padStart(2, '0')}:00`}
                    </label>
                );
            }
        } else {
            // Add all remaining time options for other dates
            for (let i = currentHour; i < 24; i++) {
                const time = `${i}`.padStart(2, '0');
                timeOptions.push(
                    <label key={time}>
                        <input
                            type="radio"
                            name="time"
                            value={time}
                            checked={selectedTime === time}
                            onChange={handleChange("selectedTime")}
                        />
                        {`${time}:00-${time === '23' ? '00' : `${parseInt(time) + 1}`.padStart(2, '0')}:00`}
                    </label>
                );
            }
        }

        return timeOptions;
    };

    return (
        <div className='filter-card-wrapper'>
            <div className='filter-card-container'>
                <div className='filter-card-position-section'>
                    <label className='custom-checkbox-container-filters'>
                        <p>Date</p>
                    </label>
                    <input
                        onChange={handleChange("selectedDate")}
                        type="date"
                        value={selectedDate}
                    />

                    {/* Time options */}
                    <div className='filter-card-preset-section'>
                        <label className='custom-checkbox-container-filters'>
                            <p>Time</p>
                        </label>
                        <div className='filter-card-preset-section-options'>
                            {renderTimeOptions()}
                        </div>
                    </div>
                </div>
            </div>
            <div className='filter-card-button-area'>
                <p onClick={handleClearFilters} className='clear-filters-button'>Clear Filters</p>
                <button onClick={handleApplyFilters} className='apply-filters-button'>Apply</button>
            </div>
        </div>
    );
};

export default GraphFilters;