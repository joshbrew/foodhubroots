import React, { Component, ReactNode } from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import LoadingIndicator from '../spinner/LoadingIndicator';

interface PopoverComponentProps {
  title?: ReactNode; // Title displayed in the popover
  content?: ReactNode; // Body content of the popover
  placement?: 'top' | 'right' | 'bottom' | 'left'; // Popover placement
  trigger?: 'click' | 'hover' | 'focus'; // Trigger action
  style?: React.CSSProperties; // Custom styling for the popover
  buttonLabel?: string; // Label for the button triggering the popover
  isLoading?: boolean; // Show a loading indicator
  onShow?: () => void; // Callback when the popover is shown
  onHide?: () => void; // Callback when the popover is hidden
}

interface PopoverComponentState {
  show: boolean; // Popover visibility state
}

class PopoverComponent extends Component<PopoverComponentProps, PopoverComponentState> {
  static defaultProps = {
    placement: 'top',
    trigger: 'click',
    buttonLabel: 'Toggle Popover',
    isLoading: false,
  };

  constructor(props: PopoverComponentProps) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleToggle = () => {
    this.setState(
      (prevState) => ({ show: !prevState.show }),
      () => {
        if (this.state.show) {
          this.props.onShow?.();
        } else {
          this.props.onHide?.();
        }
      }
    );
  };

  render() {
    const { title, content, placement, trigger, style, buttonLabel, isLoading } = this.props;
    const { show } = this.state;

    const popover = (
      <Popover id="custom-popover" style={style}>
        {title && <Popover.Header>{title}</Popover.Header>}
        <Popover.Body>
          {isLoading ? <LoadingIndicator isLoading={isLoading} /> : content}
        </Popover.Body>
      </Popover>
    );

    return (
      <OverlayTrigger
        trigger={trigger}
        placement={placement}
        show={show}
        overlay={popover}
        rootClose
        onToggle={this.handleToggle}
      >
        <Button variant="primary" onClick={this.handleToggle}>
          {buttonLabel}
        </Button>
      </OverlayTrigger>
    );
  }
}

export default PopoverComponent;


/*
import React, { useState } from 'react';
import PopoverComponent from './PopoverComponent';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<React.ReactNode>('No data loaded.');

  const handleShow = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate data fetching
      setContent('This is the dynamically loaded content!');
      setIsLoading(false);
    }, 2000); // Simulated 2-second delay
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <PopoverComponent
        title="Dynamic Popover"
        content={content}
        placement="bottom"
        trigger="click"
        buttonLabel="Show Popover"
        isLoading={isLoading}
        onShow={handleShow}
        onHide={() => console.log('Popover hidden')}
      />
    </div>
  );
};

export default App;

*/