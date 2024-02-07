import './style.sass';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PassengerForm } from './PassengerForm';
import { PassengerFormAdd } from './PassengersStepComponents';
import { NextStepButton, PrevStepButton } from 'components/OrderPage';

import { setPassengerForms } from 'reducers/order';
import {
  addEmptySeat,
  changeSeatSelection,
  changeTicketsAmount,
} from 'reducers/seats';

export const PassengersStep = () => {
  const { selectedAmount, passengersAmount, selectedSeats } = useSelector(
    (state) => state.seats,
  );

  const refArray = useRef([]);

  const initialForms = [...Array(selectedAmount)].map((_, i) => ({
    data: null,
    isValid: false,
    isExpanded: !i,
  }));

  const dispatch = useDispatch();

  const [forms, setForms] = useState(initialForms);
  const [areFormsValid, setAreFormsValid] = useState(false);

  const getFormsData = () =>
    forms.reduce((acc, curr) => {
      acc.push(curr.data);
      return acc;
    }, []);

  const onNextPassengerClick = (i) => {
    const nextForm = refArray.current[i + 1];
    if (nextForm) {
      const formsState = [...forms];
      formsState[i + 1].isExpanded = true;
      setForms([...formsState]);
      nextForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onRemovePassenger = (index, type) => {
    const splicedForm = [...forms];
    splicedForm.splice(index, 1);
    setForms(splicedForm);

    const seat = selectedSeats[index];
    const newAmount = passengersAmount[type].amount - 1;

    dispatch(changeSeatSelection({ ...seat, value: false }));
    dispatch(changeTicketsAmount({ type, number: newAmount }));
    dispatch(setPassengerForms(getFormsData()));
  };

  const onAddPassenger = () => {
    if (forms.length < 5) {
      setForms([
        ...forms,
        {
          data: null,
          isValid: false,
          isExpanded: false,
        },
      ]);

      const {
        adult: { amount },
      } = passengersAmount;

      dispatch(addEmptySeat());
      dispatch(
        changeTicketsAmount({
          type: 'adult',
          number: amount + 1,
        }),
      );
    }
  };

  const handleNextStepClick = () => {};

  const onFormChange = (data, index, isValid) => {
    const formsState = [...forms];
    formsState[index].data = data;
    formsState[index].isValid = isValid;
    setForms(formsState);

    const isThereInvalidForm = formsState.find(({ isValid }) => !isValid);
    setAreFormsValid(!isThereInvalidForm);

    const formsData = getFormsData();

    dispatch(setPassengerForms(formsData));
  };

  return (
    <>
      {forms.map(({ isExpanded }, i) => (
        <PassengerForm
          key={i}
          onFormChange={onFormChange}
          passengers={forms}
          isExpandedProp={isExpanded}
          formIndex={i}
          onNextPassengerClick={onNextPassengerClick}
          onRemovePassenger={onRemovePassenger}
          isLast={i + 1 === forms.length}
          innerRef={(ref) => {
            refArray.current[i] = ref;
          }}
        />
      ))}
      <PassengerFormAdd onAddPassenger={onAddPassenger} />

      <div className="step-buttons__container">
        <PrevStepButton type="prev">Назад</PrevStepButton>
        <NextStepButton
          type="next"
          disabled={!areFormsValid}
          onClick={handleNextStepClick}
        >
          Далее
        </NextStepButton>
      </div>
    </>
  );
};
