import './style.sass';

import cn from 'classnames';
import { useSelector } from 'react-redux';
import { getHours, getMinutes } from 'date-fns';

import { Header } from 'components/Header';
import {
  TicketDetails,
  TicketDetailsHeader,
  TicketDetailsSection,
  Icon,
  TicketDetailsSectionContent,
} from './TicketDetails';

import { ReactComponent as ArrowInRectangleIcon } from 'assets/icons/arrow_in_rectangle.svg';
import { ReactComponent as PersonIcon } from 'assets/icons/person.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';

import {
  formatNumber,
  getPlural,
  getTwoDigitNumber,
  pluralWords,
} from 'lib/helpers';

export const TicketDetailsInfo = () => {
  const {
    tripInfo,
    price,
    passengersAmount: { adult, child },
  } = useSelector((state) => state.seats);

  return (
    <TicketDetails>
      <TicketDetailsSection>
        <Header className="ticket-details__info_header" size="s">
          Детали поездки
        </Header>
      </TicketDetailsSection>

      <TicketDetailsSection
        isExpandable
        headerSlot={
          <TicketDetailsHeader
            title="Туда"
            iconSlot={
              <Icon
                wrapperClassName="ticket-details__icon"
                icon={ArrowInRectangleIcon}
              />
            }
            asideSlot={<TicketDetailsDate date="22.10.2022" />}
          />
        }
      >
        <TicketDetailsSectionContent>
          <TicketDetailsTripInfo {...tripInfo} />
        </TicketDetailsSectionContent>
      </TicketDetailsSection>

      <TicketDetailsSection
        isExpandable
        headerSlot={
          <TicketDetailsHeader
            title="Обратно"
            iconSlot={
              <Icon
                wrapperClassName="ticket-details__icon"
                iconClassName="arrow_left"
                icon={ArrowInRectangleIcon}
              />
            }
            asideSlot={<TicketDetailsDate date="23.10.2022" />}
          />
        }
      >
        <TicketDetailsSectionContent>
          <TicketDetailsTripInfo {...tripInfo} isReturn />
        </TicketDetailsSectionContent>
      </TicketDetailsSection>

      <TicketDetailsSection
        isExpandable
        headerSlot={
          <TicketDetailsHeader
            title="Пассажиры"
            iconSlot={
              <Icon wrapperClassName="ticket-details__icon" icon={PersonIcon} />
            }
          />
        }
      >
        <TicketDetailsSectionContent>
          {!!adult.amount && (
            <TicketDetailsTicketSum
              type="adult"
              amount={adult.amount}
              sum={price.adult}
            />
          )}
          {!!child.amount && (
            <TicketDetailsTicketSum
              type="child"
              amount={child.amount}
              sum={price.child}
            />
          )}
          {!!price.features && (
            <TicketDetailsTicketSum type="features" sum={price.features} />
          )}
        </TicketDetailsSectionContent>
      </TicketDetailsSection>

      <TicketDetailsSection>
        <TicketDetailsRow>
          <div className="ticket-details__info_total">Итог</div>
          <div className="ticket-details__info_price">
            <span>{formatNumber(price.total)} </span>
            <span className="ticket-details__info_currency">₽</span>
          </div>
        </TicketDetailsRow>
      </TicketDetailsSection>
    </TicketDetails>
  );
};

const TicketDetailsTripInfo = ({ from, to, duration, train, isReturn }) => {
  return (
    <>
      <TicketDetailsRow>
        <TicketDetailsRowLabel value="№ Поезда" />
        <TicketDetailsRowValue value={train.name} />
      </TicketDetailsRow>

      <TicketDetailsRow>
        <TicketDetailsRowLabel value="Название" />
        <TicketDetailsFromTo from={from.city.name} to={to.city.name} />
      </TicketDetailsRow>

      <div className="ticket-details__arrival-dates">
        <TicketDetailsRow className="ticket-details__arrival-time">
          <TicketDetailsRowValue value="00:10" />
          <div>
            <TicketDetailsTripDuration duration={duration} />
            <Icon
              wrapperClassName={cn('ticket-details__icon_arrow', {
                arrow_left: isReturn,
              })}
              icon={ArrowIcon}
            />
          </div>
          <TicketDetailsRowValue value="10:10" />
        </TicketDetailsRow>

        <TicketDetailsRow>
          <TicketDetailsDate
            className="ticket-details__date_grey"
            date="22.10.2022"
          />
          <TicketDetailsDate
            className="ticket-details__date_grey"
            date="23.10.2022"
          />
        </TicketDetailsRow>
      </div>

      <TicketDetailsRow>
        <TicketDetailsStation
          city={from.city.name}
          station={from.railway_station_name}
        />
        <TicketDetailsStation
          city={to.city.name}
          station={to.railway_station_name}
        />
      </TicketDetailsRow>
    </>
  );
};

const TicketDetailsRow = ({ className, children }) => {
  return <div className={cn('ticket-details__row', className)}>{children}</div>;
};

const TicketDetailsRowLabel = ({ value }) => {
  return <div className="ticket-details__row_label">{value}</div>;
};

const TicketDetailsRowValue = ({ value, children }) => {
  return <div className="ticket-details__row_value">{value || children}</div>;
};

const TicketDetailsDate = ({ date, className }) => {
  return <span className={cn('ticket-details__date', className)}>{date}</span>;
};

const TicketDetailsFromTo = ({ from, to }) => {
  return (
    <div className="ticket-details__from-to">
      <div className="ticket-details__from-to_city">{from}</div>
      <div className="ticket-details__from-to_city">{to}</div>
    </div>
  );
};

const TicketDetailsTripDuration = ({ duration }) => {
  const hours = getHours(duration);
  const minutes = getTwoDigitNumber(getMinutes(duration));

  return (
    <div className="ticket-details__trip-duration">
      {hours} : {minutes}
    </div>
  );
};

const TicketDetailsStation = ({ city, station }) => {
  return (
    <div className="ticket-details__station">
      <div className="ticket-details__station_city">{city}</div>
      <div className="ticket-details__station_name">{station} вокзал</div>
    </div>
  );
};

const TicketDetailsTicketSum = ({ amount, type, sum }) => {
  const label =
    type === 'features'
      ? 'Услуги'
      : getPlural(amount, pluralWords[`${type}Passengers`]);

  return (
    <TicketDetailsRow>
      <TicketDetailsRowLabel value={label} />
      <TicketDetailsRowValue>
        <span>{formatNumber(sum)}</span>
        <span className="ticket-details__tickets-summary_currency">₽</span>
      </TicketDetailsRowValue>
    </TicketDetailsRow>
  );
};
