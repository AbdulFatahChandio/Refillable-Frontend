export const selectStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    // fontSize: '1rem',
    fontSize: '0.9375',
    color: '#6B7280',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    cursor: 'pointer',
    borderBottom: '1px solid #ffffff',
    backgroundColor: state.isSelected
      ? '#E5E7EB'
      : state.isFocused
        ? '#F9FAFB'
        : '#ffffff',
  }),
  control: (_: any, state: any) => ({
    display: 'flex',
    alignItems: 'center',
    minHeight: 38,
    // backgroundColor: '#F3F4F6',
    backgroundColor: '#ffffff',
    borderRadius: 9,
    border: '1px solid #ffffff',
    borderColor: state.isFocused ? 'rgb(var(--color-accent-500))' : '#ffffff',
    boxShadow:
      state.menuIsOpen &&
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused ? '#9CA3AF' : '#cccccc',
    '&:hover': {
      color: '#9CA3AF',
    },
  }),
  clearIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused ? '#9CA3AF' : '#cccccc',
    padding: 0,
    cursor: 'pointer',

    '&:hover': {
      color: '#9CA3AF',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: 9,
    border: '1px solid #E5E7EB',
    boxShadow:
      '0 1px 2px 0 rgba(0, 0, 0, 0.01), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  }),
  valueContainer: (provided: any, _: any) => ({
    ...provided,
    paddingLeft: 16,
    border: 9,
  }),
  singleValue: (provided: any, _: any) => ({
    ...provided,
    // fontSize: '1rem',
    fontSize: '0.9375rem',
    color: '#4B5563',
  }),
  multiValue: (provided: any, _: any) => ({
    ...provided,
    backgroundColor: 'rgb(var(--color-accent-400))',
    borderRadius: 9999,
    overflow: 'hidden',
    boxShadow:
      '0 0px 3px 0 rgba(0, 0, 0, 0.1), 0 0px 2px 0 rgba(0, 0, 0, 0.06)',
  }),
  multiValueLabel: (provided: any, _: any) => ({
    ...provided,
    paddingLeft: 10,
    fontSize: '0.9375rem',
    color: '#ffffff',
  }),
  multiValueRemove: (provided: any, _: any) => ({
    ...provided,
    paddingLeft: 0,
    paddingRight: 8,
    color: '#ffffff',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: 'rgb(var(--color-accent-300))',
      color: '#F3F4F6',
    },
  }),
  placeholder: (provided: any, _: any) => ({
    ...provided,
    fontSize: '0.9375',
    color: '#555555',
  }),
  noOptionsMessage: (provided: any, _: any) => ({
    ...provided,
    fontSize: '0.9375',
    color: 'rgba(107, 114, 128, 0.7)',
  }),
};




export const outlineSelectStyles = {
  option: (provided: any, state: any) => ({
    
    ...provided,
    // fontSize: '1rem',
    fontSize: '0.875rem',
    color: state.isSelected ? '#ffffff' : 'var(--brown-color)',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    cursor: 'pointer',
    // borderBottom: '1px solid #E5E7EB',
    backgroundColor: state.isSelected
      ? 'var(--brown-color)'
      : state.isFocused
        ? 'var(--pale-mint)'
        : '#ffffff',
    ':active': {
      backgroundColor: 'var(--brown-color)',
      color: '#ffffff',
    },
  }),
  control: (_: any, state: any) => ({
    display: 'flex',
    alignItems: 'center',
    minHeight: 50,
    backgroundColor: 'transparent',
    borderRadius: 0,
    border: '1px solid #BAE6FD',
    textTransform: 'uppercase' as const,
    color: '#ffffff',
    cursor: 'pointer',
    // boxShadow:
    //   state.menuIsOpen &&
    //   '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    boxShadow: "none",
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused ? 'var(--primary-color)' : 'var(--light-brown-color)',
    padding: 8,
    '&:hover': {
      color: 'var(--primary-color)',
    },
    display: 'flex',
  }),
  clearIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused ? '#9CA3AF' : '#cccccc',
    padding: 0,
    cursor: 'pointer',

    '&:hover': {
      color: '#9CA3AF',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: 0,
    border: '1px solid #BAE6FD',
    minWidth: '200px',
    backgroundColor: '#ffffff',
    color: 'var(--brown-color)',
    padding: 0,
    zIndex: 9999,
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 999999,
  }),
  menuList: (provided: any) => ({
    ...provided,
    maxHeight: 260,
    padding: 0,
    WebkitOverflowScrolling: 'touch',
    scrollbarColor: 'var(--light-brown-color) var(--pale-mint)',
  }),
  valueContainer: (provided: any, _: any) => ({
    ...provided,
    // paddingLeft: 16,
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#474747',
    margin: 0,
    padding: 0,
  }),
  singleValue: (provided: any, _: any) => ({
    ...provided,
    // fontSize: '1rem',
    fontSize: '13px',
    color: '#474747',
  }),
  multiValue: (provided: any, _: any) => ({
    ...provided,
    backgroundColor: '#000',
    borderRadius: 9999,
    overflow: 'hidden',
    boxShadow:
      '0 0px 3px 0 rgba(0, 0, 0, 0.1), 0 0px 2px 0 rgba(0, 0, 0, 0.06)',
  }),
  multiValueLabel: (provided: any, _: any) => ({
    ...provided,
    paddingLeft: 10,
    paddingRight: 8,
    fontSize: '0.9375rem',
    color: '#ffffff',
  }),
  multiValueRemove: (provided: any, _: any) => ({
    ...provided,
    paddingLeft: 8,
    paddingRight: 8,
    color: '#ffffff',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: 'rgb(var(--color-accent-300))',
      color: '#F3F4F6',
    },
  }),
  placeholder: (provided: any, _: any) => ({
    ...provided,
    fontSize: '13px',
    color: '#000',
  }),
  noOptionsMessage: (provided: any, _: any) => ({
    ...provided,
    fontSize: '0.875rem',
    color: 'var(--brown-color)',
  }),
};
