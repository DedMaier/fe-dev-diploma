import './style.sass';

import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as ConditionerIcon } from 'assets/icons/conditioner.svg';
import { ReactComponent as WiFiIcon } from 'assets/icons/wifi.svg';
import { ReactComponent as BedclothesIcon } from 'assets/icons/bedclothes.svg';
import { ReactComponent as DrinksIcon } from 'assets/icons/drinks.svg';

import { formatNumber } from 'lib/helpers';
import { changeFeatureSelection, recalculatePrice } from 'reducers/seats';

const seatTypes = [
  { priceName: 'top_price', label: 'Верхние' },
  { priceName: 'bottom_price', label: 'Нижние' },
  { priceName: 'side_price', label: 'Боковые' },
];

export const PlacesTable = ({
  available_seats = 0,
  have_wifi = false,
  have_air_conditioning = false,
  linens_price,
  wifi_price,
  is_linens_included = false,
  ...props
}) => {
  return (
    <div className="places__table">
      <PlacesTableCol>
        <PlacesTableCell type="header">
          <span>Места </span>
          <PlacesTableQuantity>{available_seats}</PlacesTableQuantity>
        </PlacesTableCell>
        {seatTypes.map(({ priceName, label }) =>
          props[priceName] ? (
            <PlacesTableCell key={priceName} type="seat-type">
              <span>{label} </span>
              <PlacesTableQuantity>3</PlacesTableQuantity>
            </PlacesTableCell>
          ) : null,
        )}
      </PlacesTableCol>

      <PlacesTableCol>
        <PlacesTableCell type="header">
          <span>Стоимость</span>
        </PlacesTableCell>
        {seatTypes.map(({ priceName }) =>
          props[priceName] ? (
            <PlacesTableCell key={priceName} type="price">
              <span>{formatNumber(props[priceName])} </span>
              <PlacesTableCurrencySign />
            </PlacesTableCell>
          ) : null,
        )}
      </PlacesTableCol>

      <PlacesTableCol>
        <PlacesTableCell type="header">
          <span>Обслуживание </span>
          <span className="places__table_fpc">ФПК</span>
        </PlacesTableCell>
        <PlacesTableCell type="features">
          {have_air_conditioning && (
            <PlacesTableFeature
              name="air_conditioning"
              icon={ConditionerIcon}
              title="кондиционер"
              isIncluded
              railcarId={props._id}
            />
          )}

          {have_wifi && (
            <PlacesTableFeature
              name="wifi"
              icon={WiFiIcon}
              title="Wi-Fi"
              price={wifi_price}
              railcarId={props._id}
            />
          )}

          {is_linens_included || linens_price ? (
            <PlacesTableFeature
              name="linens"
              icon={BedclothesIcon}
              title="бельё"
              isIncluded={is_linens_included}
              price={!is_linens_included && linens_price}
              railcarId={props._id}
            />
          ) : null}

          <PlacesTableFeature
            name="feed"
            icon={DrinksIcon}
            title="питание"
            price={90}
            railcarId={props._id}
          />
        </PlacesTableCell>
      </PlacesTableCol>
    </div>
  );
};

const PlacesTableCol = ({ children }) => {
  return <div className="places__table_column">{children}</div>;
};

const PlacesTableCell = ({ children, type }) => {
  return <div className={`places__table_cell_${type}`}>{children}</div>;
};

const PlacesTableQuantity = ({ children }) => {
  return <span className="places__table_quantity">{children}</span>;
};

const PlacesTableCurrencySign = () => {
  return <span className="places__table_currency">₽</span>;
};

const PlacesTableFeature = ({
  name,
  icon: Icon,
  title,
  isIncluded,
  price = 0,
  railcarId,
}) => {
  const dispatch = useDispatch();
  const { selectedFeatures } = useSelector((state) => state.seats);

  const railcarFeatures = selectedFeatures[railcarId];
  const isSelected = railcarFeatures?.[name]?.value;

  const handleClick = () => {
    if (isIncluded) {
      return;
    }

    dispatch(
      changeFeatureSelection({
        id: railcarId,
        feature: name,
        value: !isSelected,
        price,
      }),
    );
    dispatch(recalculatePrice());
  };

  return (
    <button
      className={cn('places__table_feature', {
        included: isIncluded,
        selected: isSelected,
      })}
      onClick={handleClick}
    >
      <Icon className="places__table_feature_icon" />
      <div className="places__table_feature_title">
        {title} ({price ? `+${price} ₽` : 'включено в стоимость'})
      </div>
    </button>
  );
};
