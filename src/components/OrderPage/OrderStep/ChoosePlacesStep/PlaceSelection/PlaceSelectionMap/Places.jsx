import './style.sass';

import cn from 'classnames';

import {
  FirstClassPlacement,
  PlaceItem,
  PlaceItemRow,
  SecondClassPlacement,
  ThirdClassPlacement,
} from './PlaceItemPlacement';

export const FirstClassPlaces = ({ ...props }) => {
  return (
    <PlaceListContainer railcarClass="first">
      <PlaceItemList railcarClass="first">
        {[...Array(8)].map((_, i) => {
          return (
            <FirstClassPlacement key={i} {...props} firstNumber={i * 2 + 1} />
          );
        })}
      </PlaceItemList>
      <PlaceItemListEmpty />
    </PlaceListContainer>
  );
};

export const SecondClassPlaces = ({ ...props }) => {
  return (
    <PlaceListContainer railcarClass="second">
      <PlaceItemList railcarClass="second">
        {[...Array(8)].map((_, i) => {
          return (
            <SecondClassPlacement key={i} firstNumber={i * 4 + 1} {...props} />
          );
        })}
      </PlaceItemList>
      <PlaceItemListEmpty />
    </PlaceListContainer>
  );
};

export const ThirdClassPlaces = ({ side_price, ...props }) => {
  return (
    <PlaceListContainer railcarClass="third">
      <PlaceItemList railcarClass="third">
        {[...Array(8)].map((_, i) => {
          return (
            <ThirdClassPlacement key={i} {...props} firstNumber={i * 4 + 1} />
          );
        })}
      </PlaceItemList>
      <PlaceItemList railcarClass="third" isLeftSide={true}>
        {[...Array(8)].map((_, i) => (
          <li key={i} className="place__row_left-train-side">
            <PlaceItem
              {...props}
              railcarClass="third"
              placeNumber={i * 2 + 33}
              isLeftSide={true}
              price={side_price}
            />
            <PlaceItem
              {...props}
              railcarClass="third"
              placeNumber={i * 2 + 34}
              isLeftSide={true}
              price={side_price}
            />
          </li>
        ))}
      </PlaceItemList>
    </PlaceListContainer>
  );
};

export const FourthClassPlaces = ({ ...props }) => {
  return (
    <PlaceListContainer railcarClass="fourth">
      <SittingPlaceItemList {...props} firstNumber={1} side="right" />
      <SittingPlaceItemList {...props} firstNumber={33} side="left" />
    </PlaceListContainer>
  );
};

const PlaceListContainer = ({ railcarClass, children }) => {
  return (
    <div
      className={cn(
        'place__list_container',
        `place__list_container_${railcarClass}-class`,
      )}
    >
      {children}
    </div>
  );
};

const PlaceItemList = ({ railcarClass, children, isLeftSide }) => {
  return (
    <ul
      className={cn(
        'place__list',
        { [`place__list_${railcarClass}-class`]: railcarClass },
        isLeftSide ? 'place__list_left-side' : 'place__list_right-side',
      )}
    >
      {children}
    </ul>
  );
};

const SittingPlaceItemList = ({ firstNumber, side, top_price, ...props }) => {
  return (
    <ul className={`place__list_fourth-class_${side}-side`}>
      {[...Array(16)].map((_, i) => {
        return (
          <PlaceItemRow key={i} railcarClass="fourth">
            <PlaceItem
              {...props}
              placeNumber={i * 2 + firstNumber}
              railcarClass="fourth"
              price={top_price}
            />
            <PlaceItem
              {...props}
              placeNumber={i * 2 + firstNumber + 1}
              railcarClass="fourth"
              price={top_price}
            />
          </PlaceItemRow>
        );
      })}
    </ul>
  );
};

const PlaceItemListEmpty = () => {
  return (
    <PlaceItemList isLeftSide={true}>
      {[...Array(8)].map((_, i) => {
        return (
          <div
            key={i}
            className="place__row_left-train-side place__row_empty"
          />
        );
      })}
    </PlaceItemList>
  );
};
