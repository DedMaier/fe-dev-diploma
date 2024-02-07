import {
  FirstClassPlaces,
  FourthClassPlaces,
  SecondClassPlaces,
  ThirdClassPlaces,
} from './Places';

const railcarFrontImg = require('assets/railcar_front_side.png');
const railcarBackImg = require('assets/railcar_back_side.png');

export const PlaceSelectionMap = ({ railcarClass, ...props }) => {
  return (
    <div className="places__selection-map">
      <div className="places__railcar-side">
        {/* нигде в данных не вижу номеров вагона в виде цифр */}
        <div className="places__railcar-side_number">00</div>
        <img
          className="places__railcar-side_img"
          src={railcarFrontImg}
          alt="Схематическое изображение передней части вагона"
        />
      </div>
      {(() => {
        switch (railcarClass) {
          case 'fourth':
            return <FourthClassPlaces {...props} />;
          case 'third':
            return <ThirdClassPlaces {...props} />;
          case 'second':
            return <SecondClassPlaces {...props} />;
          case 'first':
          default:
            return <FirstClassPlaces {...props} />;
        }
      })()}
      <div className="places__railcar-side">
        <img
          className="places__railcar-side_img"
          src={railcarBackImg}
          alt="Схематическое изображение задней части вагона"
        />
      </div>
    </div>
  );
};
