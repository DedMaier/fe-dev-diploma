import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import { EmailInput } from 'components/Input';
import { Button } from 'components/Button';
import { patternValues } from 'components/OrderPage/OrderStep/helpers';
import { Form } from 'lib/Form';

import { ReactComponent as Youtube } from '../../assets/icons/youtube.svg';
import { ReactComponent as Linkedin } from '../../assets/icons/linked_in.svg';
import { ReactComponent as Googleplus } from '../../assets/icons/google_plus.svg';
import { ReactComponent as Twitter } from '../../assets/icons/twitter.svg';
import { ReactComponent as Facebook } from '../../assets/icons/facebook.svg';

import { subscribeAsync } from 'reducers/app';

const socialNetworks = [
  { icon: Youtube, link: 'https://youtube.com' },
  { icon: Linkedin, link: 'https://ru.linkedin.com/' },
  { icon: Googleplus, link: 'https://google.com' },
  { icon: Twitter, link: 'https://twitter.com' },
  { icon: Facebook, link: 'https://facebook.com' },
];

export const FooterSubscription = () => {
  const dispatch = useDispatch();
  const form = useForm({ defaultValues: { email: '' }, mode: 'onChange' });

  const {
    formState: { isValid },
  } = form;

  const handleSubmit = ({ email }) => {
    dispatch(subscribeAsync(email));
  };

  return (
    <div className="subscription">
      <div className="subscription__form_container">
        <h4 className="footer__header header_size_s">Подписка</h4>
        <div className="subscription__text">Будьте в курсе событий</div>
        <Form
          className="subscription__form"
          form={form}
          onSubmit={handleSubmit}
        >
          <EmailInput
            name="email"
            size="l"
            placeholder="e-mail"
            required
            pattern={{
              value: patternValues.email,
            }}
          />
          <Button
            classname="footer__button"
            type="submit"
            styleName="transparent-light"
            size="l"
            disabled={!isValid}
          >
            Отправить
          </Button>
        </Form>
      </div>
      <div className="socials">
        <h4 className="footer__header header_size_s">Подписывайтесь на нас</h4>
        <ul className="socials__list">
          {socialNetworks.map(({ icon: IconComponent, link }, i) => (
            <li key={i} className="socials__item">
              <a
                className="social__link"
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                <IconComponent className="social__icon" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
