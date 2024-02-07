import './style.sass';
import { useDispatch, useSelector } from 'react-redux';

import { changeTicketsAmount } from 'reducers/seats';
import { getPlural, pluralWords } from 'lib/helpers';

export const TicketAmountForm = () => {
  const dispatch = useDispatch();

  const {
    passengersAmount: { adult, child, baby },
  } = useSelector((state) => state.seats);

  const onInputChange = (type, number) => {
    dispatch(changeTicketsAmount({ type, number: +number }));
  };

  return (
    <form className="ticket-amount__form">
      <TicketAmountBlock
        name="adult"
        label="Взрослых"
        value={adult.amount}
        onInputChange={onInputChange}
        {...adult}
      />
      <TicketAmountBlock
        name="child"
        label="Детских"
        value={child.amount}
        onInputChange={onInputChange}
        {...child}
      />
      <TicketAmountBlock
        name="baby"
        label="Детских «без места»"
        value={baby.amount}
        onInputChange={onInputChange}
        {...baby}
      />
    </form>
  );
};

const TicketAmountBlock = ({ name, limit, amount, ...props }) => {
  return (
    <div className="ticket-amount__block">
      <TicketAmountInput name={name} max={limit} {...props} />
      <div className="ticket-amount__block_description">
        {(() => {
          switch (name) {
            case 'adult':
              return `Можно добавить еще ${getPlural(
                limit - amount,
                pluralWords.passengers,
              )}`;
            case 'child':
              return `Можно добавить еще ${getPlural(
                limit - amount,
                pluralWords.children,
              )} до 10 лет. Свое место в вагоне, как у взрослых, но дешевле 
                в среднем на 50-65%`;
            default:
              return `Можно добавить еще ${getPlural(
                limit - amount,
                pluralWords.children,
              )} без места`;
          }
        })()}
      </div>
    </div>
  );
};

const TicketAmountInput = ({ label, max, name, onInputChange, ...props }) => {
  const handleInputChange = ({ target: { value } }) => {
    onInputChange(name, value);
  };

  return (
    <label className="ticket-amount__input_label">
      <div className="ticket-amount__input_text">{label} — </div>
      <input
        className="ticket-amount__input"
        name={name}
        min={0}
        max={max}
        type="number"
        placeholder="0"
        onChange={handleInputChange}
        {...props}
      />
    </label>
  );
};
