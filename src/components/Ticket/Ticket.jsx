import './style.sass';

import cn from 'classnames';
import { nanoid } from 'nanoid';
import { getHours, getMinutes } from 'date-fns';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Header } from 'components/Header';
import { Button } from 'components/Button';
import { Icon } from 'components/OrderPage/TicketDetails/TicketDetails';
import { formatDateToHM, formatNumber, getTwoDigitNumber } from 'lib/helpers';

import { ReactComponent as TrainIcon } from 'assets/icons/train.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as WiFiIcon } from 'assets/icons/wifi.svg';
import { ReactComponent as ExpressIcon } from 'assets/icons/express.svg';
import { ReactComponent as FeedIcon } from 'assets/icons/drinks.svg';

import { setTripInfo } from 'reducers/seats';
import { setStep } from 'reducers/stepper';

const features = {
  have_wifi: { icon: WiFiIcon, label: 'Wi-Fi', id: nanoid() },
  is_express: { icon: ExpressIcon, label: 'Экспресс', id: nanoid() },
  have_feed: { icon: FeedIcon, label: 'Питание', id: nanoid() },
};

const classTitles = {
  fourth: 'Сидячий',
  third: 'Плацкарт',
  second: 'Купе',
  first: 'Люкс',
};

const classOrder = Object.keys(classTitles);

export const Ticket = ({
  isChecking,
  from,
  to,
  train,
  price_info,
  available_seats_info,
  duration,
  _id,
  ...props
}) => {
  const dispatch = useDispatch();

  const availableSeats = classOrder.reduce((acc, classType) => {
    const seatsCount = available_seats_info[classType];
    if (seatsCount) {
      acc.push({
        seatsCount,
        minPrice: price_info[classType].top_price,
        classTitle: classTitles[classType],
      });
    }
    return acc;
  }, []);

  const handleChangePlaces = () => {
    dispatch(setStep(1));
  };

  const handleChoosePlaces = () => {
    dispatch(
      setTripInfo({
        from,
        to,
        train,
        price_info,
        available_seats_info,
        duration,
      }),
    );
  };

  return (
    <div
      className={cn('tickets__item', { tickets__item_checking: isChecking })}
    >
      <div className="ticket__main-info">
        <div className="ticket__main-info_header">
          <div className="ticket__train-icon_wrapper">
            <TrainIcon className="ticket__train-icon" />
          </div>
          <Header className="ticket__header" size="xs">
            {train.name}
          </Header>
        </div>
        <TripCities from={from} to={to} />
      </div>
      <TicketDirections duration={duration} from={from} to={to} />
      <div className="ticket__places">
        <ul className="ticket__places_list">
          {availableSeats.map((seats) => (
            <TicketPlacesItem key={seats.classTitle} {...seats} />
          ))}
        </ul>
        <TicketFeatures {...props} />
        {isChecking ? (
          <Button
            size="s"
            styleName="transparent-dark"
            onClick={handleChangePlaces}
          >
            Изменить
          </Button>
        ) : (
          <Link to={`/seats/${_id}`}>
            <Button size="s" styleName="colored" onClick={handleChoosePlaces}>
              Выбрать места
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export const TicketFeatures = ({
  have_wifi = true,
  is_express = true,
  have_feed = true,
}) => {
  return (
    <ul className="ticket__places_features">
      {have_wifi && <TicketPlacesFeature {...features.have_wifi} />}
      {is_express || (true && <TicketPlacesFeature {...features.is_express} />)}
      {have_feed && <TicketPlacesFeature {...features.have_feed} />}
    </ul>
  );
};

const TicketPlacesFeature = ({ icon, label, id }) => {
  return (
    <li className="ticket__places_features_item" key={id} title={label}>
      <Icon wrapperClassName="ticket__places_feature_icon" icon={icon} />
    </li>
  );
};

export const TripCities = ({ from, to }) => {
  return (
    <div className="ticket__trip-points">
      <div className="ticket__trip-points_item">
        {from?.city.name || 'Город 1'} →
      </div>
      <div className="ticket__trip-points_item">
        {to?.city.name || 'Город 2'}
      </div>
    </div>
  );
};

const TicketDirections = ({ ...props }) => {
  return (
    <div className="ticket__directions">
      <TicketDirection direction="forward" {...props} />
      <TicketDirection direction="backward" {...props} />
    </div>
  );
};

export const TicketDirection = ({
  duration,
  direction,
  from,
  to,
  noDuration,
}) => {
  const hours = getHours(duration);
  const minutes = getTwoDigitNumber(getMinutes(duration));

  return (
    <div
      className={cn('direction', {
        direction_reversed: direction === 'backward',
      })}
    >
      <TripPoint {...from} />
      <div className="trip__duration_container">
        {!noDuration && (
          <div className="trip__duration">
            {hours} : {minutes}
          </div>
        )}
        <div className="trip__direction trip__direction_right">
          {direction === 'forward' ? (
            <ArrowIcon className="trip__direction_icon" />
          ) : (
            <ArrowIcon className="trip__direction_icon arrow_left" />
          )}
        </div>
      </div>
      <TripPoint {...to} />
    </div>
  );
};

export const TripPoint = ({
  datetime = 0,
  city = { name: 'Какой-то город' },
  railway_station_name = 'Какой-то',
}) => {
  return (
    <div className="trip__point">
      <div className="trip__point_time">{formatDateToHM(datetime)}</div>
      <div className="trip__point_city">{city.name}</div>
      <div className="trip__point_station">{railway_station_name} вокзал</div>
    </div>
  );
};

const TicketPlacesItem = ({ classTitle, seatsCount, minPrice }) => {
  return (
    <div className="trip__places_item">
      <div className="place__type">{classTitle}</div>
      <div className="place__quantity">{seatsCount}</div>
      <div className="place__price">
        <span className="place__price_from">от</span>
        <span className="place__price_amount">{formatNumber(minPrice)}</span>
        <span className="place__price_currency">₽</span>
      </div>
    </div>
  );
};
