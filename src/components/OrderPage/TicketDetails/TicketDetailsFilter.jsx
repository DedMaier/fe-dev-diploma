import './style.sass';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { DateInput, Input } from '../../Input';
import { HoursRangeSlider, RangeSlider } from './RangeSlider';
import {
  Icon,
  TicketDetails,
  TicketDetailsHeader,
  TicketDetailsSection,
} from './TicketDetails';
import { Form } from 'lib/Form';

import { ReactComponent as SecondClassIcon } from 'assets/icons/second_class.svg';
import { ReactComponent as ThirdClassIcon } from 'assets/icons/third_class.svg';
import { ReactComponent as FourthClassIcon } from 'assets/icons/fourth_class.svg';
import { ReactComponent as FirstClassIcon } from 'assets/icons/first_class.svg';
import { ReactComponent as WiFiIcon } from 'assets/icons/wifi.svg';
import { ReactComponent as ArrowInRectangleIcon } from 'assets/icons/arrow_in_rectangle.svg';

import { updateQueryParams } from 'reducers/search';
import { useSetValuesByQuery } from 'hooks/useSetValuesByQuery';

const switchList = [
  { name: 'have_second_class', icon: SecondClassIcon, label: 'Купе' },
  { name: 'have_third_class', icon: ThirdClassIcon, label: 'Плацкарт' },
  { name: 'have_fourth_class', icon: FourthClassIcon, label: 'Сидячий' },
  { name: 'have_first_class', icon: FirstClassIcon, label: 'Люкс' },
  { name: 'have_wifi', icon: WiFiIcon, label: 'Wi-Fi' },
  { name: 'have_express', icon: SecondClassIcon, label: 'Экспресс' },
];

export const TicketDetailsFilter = () => {
  const form = useForm({
    defaultValues: {
      date_start: '',
      date_end: '',
      have_first_class: false,
      have_second_class: false,
      have_third_class: false,
      have_fourth_class: false,
      have_wifi: false,
      have_air_conditioning: false,
      have_express: false,
      price_from: 0,
      price_to: 10000,
      start_departure_hour_from: 0,
      start_departure_hour_to: 24,
      start_arrival_hour_from: 0,
      start_arrival_hour_to: 24,
      end_departure_hour_from: 0,
      end_departure_hour_to: 24,
      end_arrival_hour_from: 0,
      end_arrival_hour_to: 24,
    },
  });

  const dispatch = useDispatch();

  const {
    queryParams: { date_start, date_end },
  } = useSelector((state) => state.search);

  const { setValue } = form;

  const onFieldChange = (e) => {
    dispatch(
      updateQueryParams({
        [e.target.name]: e.target.checked,
      }),
    );
  };

  const onRangeChange = ([from, to], [fromValue, toValue]) => {
    setValue(from, fromValue);
    setValue(to, toValue);
    dispatch(updateQueryParams({ [from]: fromValue, [to]: toValue }));
  };

  const onChangeDate = (name, date) => {
    setValue(name, date);
    dispatch(updateQueryParams({ [name]: date }));
  };

  useSetValuesByQuery(form.getValues(), setValue);

  return (
    <TicketDetails>
      <Form form={form} className="ticket-filter__form">
        <TicketDetailsSection isExpandable={false}>
          <div className="ticket-filter__form_dates">
            <label className="ticket-filter__form_label">
              <h4 className="header_size_s text_light ticket-filter__form_title">
                Дата поездки
              </h4>
              <DateInput
                name="date_start"
                onChangeDate={onChangeDate}
                selected={date_start}
                endDate={date_end}
                size="s"
              />
            </label>
            <label className="ticket-filter__form_label">
              <h4 className="header_size_s text_light ticket-filter__form_title">
                Дата возвращения
              </h4>
              <DateInput
                name="date_end"
                onChangeDate={onChangeDate}
                selected={date_end}
                startDate={date_start}
                size="s"
              />
            </label>
          </div>
        </TicketDetailsSection>

        <TicketDetailsSection isExpandable={false}>
          <ul className="form__switch_list">
            {switchList.map((props) => (
              <li className="form__switch_item" key={props.name}>
                <CheckboxLabel {...props} onChange={onFieldChange} />
              </li>
            ))}
          </ul>
        </TicketDetailsSection>

        <TicketDetailsSection isExpandable={false}>
          <h4 className="header_size_s text_light ticket-filter__form_title">
            Стоимость
          </h4>
          <div className="range-slider__container">
            <RangeSlider
              names={['price_from', 'price_to']}
              onRangeChange={onRangeChange}
              labelSlot={
                <div className="range-slider__from-and-to">
                  <div className="range-slider__from-and-to_item">от</div>
                  <div className="range-slider__from-and-to_item">до</div>
                </div>
              }
            />
          </div>
        </TicketDetailsSection>

        <TicketDetailsSection
          isExpandable={true}
          headerSlot={
            <TicketDetailsHeader
              title="Туда"
              className="ticket-filter__form_title"
              iconSlot={
                <Icon
                  wrapperClassName="ticket-details__icon"
                  icon={ArrowInRectangleIcon}
                />
              }
            />
          }
        >
          <TimeRangeSliders
            names={[
              ['start_departure_hour_from', 'start_departure_hour_to'],
              ['start_arrival_hour_from', 'start_arrival_hour_to'],
            ]}
            onRangeChange={onRangeChange}
          />
        </TicketDetailsSection>

        <TicketDetailsSection
          isExpandable={true}
          headerSlot={
            <TicketDetailsHeader
              title="Обратно"
              className="ticket-filter__form_title"
              iconSlot={
                <Icon
                  wrapperClassName="ticket-details__icon arrow_left"
                  icon={ArrowInRectangleIcon}
                />
              }
            />
          }
        >
          <TimeRangeSliders
            names={[
              ['end_departure_hour_from', 'end_departure_hour_to'],
              ['end_arrival_hour_from', 'end_arrival_hour_to'],
            ]}
            onRangeChange={onRangeChange}
          />
        </TicketDetailsSection>
      </Form>
    </TicketDetails>
  );
};

const TimeRangeSliders = ({ names, onRangeChange }) => {
  return (
    <div className="range-slider__container">
      <HoursRangeSlider
        names={names[0]}
        onRangeChange={onRangeChange}
        labelSlot={<div className="range-slider__title">Время отбытия</div>}
      />
      <HoursRangeSlider
        names={names[1]}
        onRangeChange={onRangeChange}
        labelSlot={
          <div className="range-slider__title range-slider__title_right">
            Время прибытия
          </div>
        }
      />
    </div>
  );
};

export const CheckboxLabel = ({ name, label, icon: Icon, ...props }) => {
  return (
    <label className="checkbox__label">
      <div className="checkbox__icon_wrapper">
        <Icon className="checkbox__icon" />
      </div>
      <span className="checkbox__label_text">{label}</span>
      <CheckboxInput {...props} name={name} />
    </label>
  );
};

export const CheckboxInput = ({ ...props }) => {
  return (
    <div className="input_checkbox_wrapper">
      <Input
        {...props}
        className="input_checkbox"
        type="checkbox"
        name={props.name}
      />
      <div className="input_checkbox_slider"></div>
    </div>
  );
};
