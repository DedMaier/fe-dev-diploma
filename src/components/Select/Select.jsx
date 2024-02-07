import './style.sass';

import cn from 'classnames';
import { useRef, useState } from 'react';

import { useOnClickOutside } from 'hooks/useOnClickOutside';

export const Select = ({ className, optionsList, selected, onSelect }) => {
  const ref = useRef();

  const initialSelectedIndex = optionsList.findIndex(
    (item) => item.value === selected,
  );

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialSelectedIndex);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const setSelectedThenCloseDropdown = (index) => {
    setSelectedOption(index);
    setIsOptionsOpen(false);

    const value = optionsList[index].value;
    onSelect(value);
  };

  const handleListKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOptionsOpen(false);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedOption(
          selectedOption - 1 >= 0 ? selectedOption - 1 : optionsList.length - 1,
        );
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedOption(
          selectedOption === optionsList.length - 1 ? 0 : selectedOption + 1,
        );
        break;
      case ' ':
      case 'SpaceBar':
      case 'Enter':
        e.preventDefault();
        setSelectedThenCloseDropdown(selectedOption);
        break;
      default:
        break;
    }
  };

  useOnClickOutside(ref, () => {
    if (isOptionsOpen) {
      setIsOptionsOpen(false);
    }
  });

  return (
    <div className={cn('select__container', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOptionsOpen}
        className={cn('select__button', isOptionsOpen ? 'expanded' : '')}
        onClick={toggleOptions}
        onKeyDown={handleListKeyDown}
      >
        {optionsList[selectedOption].label}
      </button>
      <ul
        className={`select__options ${isOptionsOpen ? 'show' : ''}`}
        ref={ref}
        role="listbox"
        aria-activedescendant={optionsList[selectedOption].label}
        tabIndex={-1}
        onKeyDown={handleListKeyDown}
      >
        {optionsList.map((option, index) => (
          <li
            key={option.value}
            className="select__options_item"
            id={option.value}
            role="option"
            aria-selected={selectedOption === index}
            tabIndex={0}
            onClick={() => {
              setSelectedThenCloseDropdown(index);
            }}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
