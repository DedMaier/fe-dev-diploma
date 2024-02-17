import './style.sass';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { PlaceSelectionMap } from './PlaceSelectionMap';
import { PlacesTable } from './PlacesTable';
import { changeRailcarSelection } from 'reducers/seats';
import { formatNumber, getPlural, pluralWords } from 'lib/helpers';

export const PlaceSelection = ({ railcarClass }) => {
  const dispatch = useDispatch();
  const { seatsInfo, price } = useSelector((state) => state.seats);

  const railcarList = seatsInfo[railcarClass];

  const onRailcarClick = (id) => {
    dispatch(changeRailcarSelection({ id, railcarClass }));
  };

  return (
    <div className="places__choosing">
      <header className="places__choosing_header">
        <div className="places__choosing_railcars">
          <div className="railcar__text">Вагоны</div>
          <ul className="railcar__list">
            {railcarList.map(({ coach: { name, _id, isSelected } }) => {
              return (
                <button
                  key={_id}
                  className={cn('railcar__item', {
                    selected: isSelected,
                  })}
                  type="button"
                  onClick={() => {
                    onRailcarClick(_id);
                  }}
                >
                  {name}
                </button>
              );
            })}
          </ul>
        </div>
        <div className="places__choosing_remark">
          Нумерация вагонов начинается с головы поезда
        </div>
      </header>
      <ul>
        {railcarList.map((railcar) => {
          return (
            railcar.coach.isSelected && (
              <PlacesChoosingRailcar
                key={railcar.coach._id}
                {...railcar}
                railcarClass={railcarClass}
              />
            )
          );
        })}
      </ul>

      <div className="places__price">
        <span className="places__price_number">
          {formatNumber(price.total)}
        </span>{' '}
        ₽
      </div>
    </div>
  );
};

const PlacesChoosingRailcar = ({ coach, seats, railcarClass }) => {
  const {
    selectedSeats: { length: selectedSeats },
    selectedAmount,
  } = useSelector((state) => state.seats);

  const { top_price, bottom_price, side_price } = coach;
  const prices = { top_price, bottom_price, side_price };

  return (
    <div className="places__choosing_railcar">
      <div className="places__choosing_info">
        <div className="railcar__number">
          <div className="railcar__number_digit">00</div>
          <div className="railcar__number_text">вагон</div>
        </div>
        <PlacesTable {...coach} />
      </div>
      <div className="places__choosing_selected-count">
        Во всех вагонах выбрано {getPlural(selectedSeats, pluralWords.seats)} из{' '}
        {selectedAmount}
      </div>
      <PlaceSelectionMap
        seats={seats}
        railcarId={coach._id}
        railcarName={coach.name}
        railcarClass={railcarClass}
        {...prices}
      />
    </div>
  );
};
