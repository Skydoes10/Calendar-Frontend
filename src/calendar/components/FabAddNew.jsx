import { addHours } from 'date-fns';
import { useCalendarStore, useUiStore } from '../../hooks';

export const FabAddNew = () => {
	const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

	const haddleClickNew = () => {
        setActiveEvent({
            title: '',
            notes: '',
            start: new Date(),
            end: addHours(new Date(), 2),
            bgColor: '#f5f5f5',
            user: {
                _id: 'qwerty',
                name: 'Ricardo',
            },
        });

		openDateModal();
	};

	return (
		<button 
            className="btn btn-primary fab" 
            onClick={haddleClickNew}
        >
			<i className="fas fa-plus"></i>
		</button>
	);
};
