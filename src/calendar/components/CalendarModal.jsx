import { useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMemo } from 'react';
import { useUiStore } from '../../hooks';
import { useEffect } from 'react';
import { useCalendarStore } from '../../hooks/useCalendarStore';
import { getEnvVariables } from '../../helpers';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

if ( getEnvVariables().VITE_MODE !== 'test' ) {
	Modal.setAppElement('#root');
};

export const CalendarModal = () => {

	const { isDateModalOpen, closeDateModal } = useUiStore();
	const { activeEvent, startSavingEvent } = useCalendarStore();
	const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2 ),
    });

	const titleClass = useMemo(() => {
		if ( !formSubmitted ) return '';

		return (formValues.title.length > 0) ? '' : 'is-invalid';
	}, [ formValues.title, formSubmitted ]);

	useEffect(() => {
		if ( activeEvent !== null ) {
			setFormValues({ ...activeEvent });
		}
	
	}, [ activeEvent ])
	

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value,
        });
    };

	const onDateChanged = ( date, changing ) => {
		setFormValues({
			...formValues,
			[ changing ]: date,
		})
	}

	const onSubmit = async ( event ) => {
		event.preventDefault();
		setFormSubmitted(true);

		const difference = differenceInSeconds( formValues.end, formValues.start );
		
		if ( isNaN( difference ) || difference <= 0 ) {
			Swal.fire({
				title: 'Incorrect date',
				text: 'The end date must be greater than the start date.',
				icon: 'error',
			});
			return;
		};

		if ( formValues.title.length === 0 ) return;

		await startSavingEvent( formValues );
		closeDateModal();
		setFormSubmitted(false);
	};

	return (
		<Modal
			isOpen={ isDateModalOpen }
			onRequestClose={ closeDateModal }
			style={customStyles}
			className="modal"
			overlayClassName={'modal-fondo'}
			closeTimeoutMS={200}
		>

			<h1>New event</h1>
			<hr />

			<form className="container" onSubmit={ onSubmit }>

				<div className="form-group mb-2">
					<label>Start date and time</label>
					<DatePicker 
                        className='form-control'
                        selected={ formValues.start }
						onChange={ (date) => onDateChanged(date, 'start') }
						dateFormat="Pp"
						showTimeSelect
                    />
				</div>

				<div className="form-group mb-2">
					<label>End date and time</label>
					<DatePicker 
						minDate={ formValues.start }
                        className='form-control'
                        selected={ formValues.end }
						onChange={ (date) => onDateChanged(date, 'end') }
						dateFormat="Pp"
						showTimeSelect
                    />
				</div>

				<hr />

				<div className="form-group mb-2">
					<label>Title and notes</label>
					<input
						type="text"
						className={ `form-control ${ titleClass }` }
						placeholder="Title of the event"
						name="title"
						autoComplete="off"
                        value={ formValues.title }
                        onChange={ onInputChanged }
					/>
					<small id="emailHelp" className="form-text text-muted">
                        Short description
					</small>
				</div>

				<div className="form-group mb-2">
					<textarea
						type="text"
						className="form-control"
						placeholder="Notes"
						rows="5"
						name="notes"
                        value={ formValues.notes }
                        onChange={ onInputChanged }
					></textarea>
					<small id="emailHelp" className="form-text text-muted">
                        Additional information
					</small>
				</div>

				<button
					type="submit"
					className="btn btn-outline-primary btn-block"
				>
					<i className="far fa-save"></i>
					<span> Save</span>
				</button>

			</form>

		</Modal>
	);
};
