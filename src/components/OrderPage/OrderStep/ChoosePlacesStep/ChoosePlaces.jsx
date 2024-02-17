import './style.sass';
import cn from 'classnames';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getHours, getMinutes } from 'date-fns';
import { getPlural, pluralWords } from 'lib/helpers';
import { Header } from 'components/Header';
import { Button } from 'components/Button';
import { PlaceSelection } from './PlaceSelection';
import { TicketAmountForm } from './TicketAmountForm';
import { NextStepButton } from 'components/OrderPage/OrderPage';
import { TicketDirection, TripCities } from 'components/Ticket/Ticket';
import { ReactComponent as SecondClassIcon } from 'assets/icons/second_class.svg';
import { ReactComponent as ThirdClassIcon } from 'assets/icons/third_class.svg';
import { ReactComponent as FourthClassIcon } from 'assets/icons/fourth_class.svg';
import { ReactComponent as FirstClassIcon } from 'assets/icons/first_class.svg';
import { ReactComponent as ClockIcon } from 'assets/icons/clock.svg';
import { ReactComponent as TrainIcon } from 'assets/icons/train.svg';
import { ReactComponent as ArrowInRectangleLarge } from 'assets/icons/arrow_in_rectangle_large.svg';
import { changeSelectedRailcarType, getSeatsDetailAsync } from 'reducers/seats';
import { setDirectionId } from 'reducers/order';

const railcarTypes = [
  { name: 'fourth', label: 'Сидячий', Icon: FourthClassIcon },
  { name: 'third', label: 'Плацкарт', Icon: ThirdClassIcon },
  { name: 'second', label: 'Купе', Icon: SecondClassIcon },
  { name: 'first', label: 'Люкс', Icon: FirstClassIcon },
];

export const ChoosePlaces = ({
  match: {
    params: { id },
  },
}) => {
  const dispatch = useDispatch();

  const { additionalPassenger } = useSelector((state) => state.seats);
  const history = useHistory();
  const {
    tripInfo,
    seatsInfo,
    selectedAmount,
    selectedSeats: { length: selectedSeats },
  } = useSelector((state) => state.seats);

  const handleNextStepClick = () => {
    history.push(`/seats/${id}/order`);
  };

  useEffect(() => {
    dispatch(setDirectionId(id));

    if (!seatsInfo) {
      dispatch(getSeatsDetailAsync(id));
    }
  }, []);

  return (
    <>
      <Header size="s" className="uppercase">
        Выбор мест
      </Header>
      <div className="places__block_list">
        <ChoosePlacesBlock
          {...tripInfo}
          seatsInfo={seatsInfo}
          direction="forward"
        />
        {/* <ChoosePlacesBlock direction="return" /> */}
      </div>
      {!additionalPassenger && (
        <NextStepButton
          disabled={!selectedAmount || selectedSeats !== selectedAmount}
          onClick={handleNextStepClick}
        >
          Далее
        </NextStepButton>
      )}
    </>
  );
};

const ChoosePlacesBlock = ({
  direction,
  from,
  to,
  train = { name: 'Лого' },
  duration = 0,
  seatsInfo,
}) => {
  const dispatch = useDispatch();

  const { selectedRailcarClass, additionalPassenger } = useSelector(
    (state) => state.seats,
  );

  const onRailcarTypeChange = (type) => {
    dispatch(changeSelectedRailcarType(type));
  };

  return (
    <div className="places__block">
      <div
        className={cn('places__change-train', {
          'places__change-train_return': direction === 'return',
        })}
      >
        <ArrowInRectangleLarge
          className={cn('arrow-in-rectangle__large', {
            arrow_left: direction === 'return',
          })}
        />
        <Button size="l" styleName="transparent-dark">
          Выбрать другой поезд
        </Button>
      </div>
      <div className="places__ticket-info">
        <div className="places__ticket-info_train-info">
          <div className="train-info__train-icon_wrapper">
            <TrainIcon className="train-info__train-icon" />
          </div>
          <div className="train-info__trip">
            <Header className="train-info__trip_header" size="xs">
              {train.name}
            </Header>
            <TripCities from={from} to={to} />
          </div>
        </div>
        <div className="directions">
          <TicketDirection
            duration={duration}
            direction={direction}
            from={from}
            to={to}
            noDuration
          />
        </div>
        <div className="places__ticket-info_time">
          <div className="icon__wrapper">
            <ClockIcon className="clock__icon" />
          </div>
          <DurationTimeText duration={duration} />
        </div>
      </div>
      {!additionalPassenger && (
        <div className="places__ticket-amount">
          <Header className="places__header" size="s">
            Количество билетов
          </Header>
          <TicketAmountForm />
        </div>
      )}

      <div className="places__railcar-type">
        <Header className="places__header" size="s">
          Тип вагона
        </Header>
        <ul className="railcar-type__buttons">
          {railcarTypes.map((item) => (
            <RailcarTypeButton
              key={item.name}
              disabled={!seatsInfo || !seatsInfo[item.name]}
              isSelected={selectedRailcarClass === item.name}
              onClick={onRailcarTypeChange}
              {...item}
            />
          ))}
        </ul>
      </div>
      {selectedRailcarClass && (
        <PlaceSelection railcarClass={selectedRailcarClass} />
      )}
    </div>
  );
};

const DurationTimeText = ({ duration }) => {
  const hours = getHours(duration);
  const minutes = getMinutes(duration);

  return (
    <div className="time__text">
      <div className="time__row">{getPlural(hours, pluralWords.hours)}</div>
      <div className="time__row">{getPlural(minutes, pluralWords.minutes)}</div>
    </div>
  );
};

const RailcarTypeButton = ({
  Icon,
  label,
  onClick,
  isSelected,
  disabled,
  name,
}) => {
  const handleClick = () => {
    onClick(name);
  };

  return (
    <button
      disabled={disabled}
      className={cn('railcar-type__button', { selected: isSelected })}
      onClick={handleClick}
      type="button"
    >
      <div className="railcar-type__icon_wrapper">
        <Icon className="railcar-type__icon" />
      </div>
      <div className="railcar-type__title">{label}</div>
    </button>
  );
};
