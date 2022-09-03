import { render, screen, fireEvent } from "@testing-library/react";
import { FabDelete } from "../../../src/calendar/components/FabDelete";
import { useCalendarStore } from "../../../src/hooks/useCalendarStore";

jest.mock("../../../src/hooks/useCalendarStore");

describe('Tests in <FabDelete />', () => {

    const mockstartDeletingEvent = jest.fn();

    beforeEach(() => jest.clearAllMocks());
	
    test('should render the component correctly', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: false,
        });

        render( <FabDelete /> );
        
        const btn = screen.getByLabelText('btn-delete');

        expect( btn.classList ).toContain('btn');
        expect( btn.classList ).toContain('btn-danger');
        expect( btn.classList ).toContain('fab-danger');
        expect( btn.style.display ).toBe('none');
    });

    test('should show the button if there is an active event', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
        });

        render( <FabDelete /> );
        
        const btn = screen.getByLabelText('btn-delete');
        
        expect( btn.style.display ).toBe('');
    });

    test('should call the startDeletingEvent function when the button is clicked', () => {
        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeletingEvent: mockstartDeletingEvent
        });

        render( <FabDelete /> );
        
        const btn = screen.getByLabelText('btn-delete');
        fireEvent.click(btn);

        expect( mockstartDeletingEvent ).toHaveBeenCalled();
    });
});
