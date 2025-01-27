import React, { Component } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';

interface MenuItem {
  label: string; // Label for the menu item
  link: string; // URL the menu item links to
  icon?: React.ReactNode; // Optional icon component
}

interface SidebarProps {
  title?: string; // Title of the sidebar
  menuItems?: MenuItem[]; // Array of menu items
  menuStyle?: 'bullet' | 'icon'; // Style of the menu: bullet list or icon list
  placement?: 'start' | 'end' | 'top' | 'bottom'; // Sidebar position
  defaultShow?: boolean; // Initial visibility
  onShow?: () => void; // Callback when the sidebar is shown
  onHide?: () => void; // Callback when the sidebar is hidden
  toggleButtonLabel?: string; // Label for the toggle button
  style?: React.CSSProperties; // Custom styling
}

interface SidebarState {
  show: boolean; // Internal visibility state
}

class Sidebar extends Component<SidebarProps, SidebarState> {
  static defaultProps = {
    placement: 'start',
    defaultShow: false,
    menuStyle: 'bullet',
    toggleButtonLabel: 'Toggle Sidebar',
  };

  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      show: props.defaultShow || false,
    };
  }

  handleShow = () => {
    this.setState({ show: true }, () => {
      this.props.onShow?.();
    });
  };

  handleHide = () => {
    this.setState({ show: false }, () => {
      this.props.onHide?.();
    });
  };

  renderMenuItems = () => {
    const { menuItems, menuStyle } = this.props;

    if (!menuItems || menuItems.length === 0) return <p>No menu items provided.</p>;

    return (
      <ul style={{ listStyleType: menuStyle === 'bullet' ? 'disc' : 'none', paddingLeft: menuStyle === 'bullet' ? '20px' : '0' }}>
        {menuItems.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {menuStyle === 'icon' && item.icon && <span style={{ marginRight: '10px' }}>{item.icon}</span>}
            <a href={item.link} style={{ textDecoration: 'none', color: '#007bff' }}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const { title, placement, toggleButtonLabel, style } = this.props;
    const { show } = this.state;

    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          {toggleButtonLabel}
        </Button>
        <Offcanvas
          show={show}
          onHide={this.handleHide}
          placement={placement}
          style={style}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{title}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>{this.renderMenuItems()}</Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
}

export default Sidebar;


/**
import React from 'react';
import Sidebar from './Sidebar';
import { FaHome, FaInfo, FaServicestack, FaPhone } from 'react-icons/fa';

const App = () => {
  const menuItems = [
    { label: 'Home', link: '#home', icon: <FaHome /> },
    { label: 'About', link: '#about', icon: <FaInfo /> },
    { label: 'Services', link: '#services', icon: <FaServicestack /> },
    { label: 'Contact', link: '#contact', icon: <FaPhone /> },
  ];

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Sidebar
        title="Sidebar Menu"
        menuItems={menuItems}
        menuStyle="icon" // Switch between "bullet" and "icon"
        placement="start"
        toggleButtonLabel="Open Sidebar"
      />
    </div>
  );
};

export default App;

 */