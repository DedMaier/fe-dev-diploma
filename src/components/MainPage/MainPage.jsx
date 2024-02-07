import './style.sass';

import { PageHeader } from 'components/PageHeader';
import { SearchTicketsForm } from 'components/SearchTicketsForm';
import { Header } from 'components/Header';
import { Features } from './Features';
import { Reviews } from './Reviews';

export const MainPage = () => {
  return (
    <>
      <section className="hero">
        <PageHeader />
        <div className="hero_content">
          <div className="hero_content_text">
            Вся жизнь — <span className="text_accent">путешествие!</span>
          </div>
          <SearchTicketsForm isSquare />
        </div>
      </section>
      <section className="about" id="about">
        <Header size="m" className="about__header">
          О нас
        </Header>
        <div className="about__content">
          <p>
            Мы рады вас видеть! Мы работаем для вас с 2003-го года. 14 лет мы
            наблюдаем, как с каждым днем всё больше людей заказывают ж/д билеты
            через интернет.
          </p>

          <p>
            Сегодня можно заказать железнодорожные билеты онлайн всего в 2
            клика, но стоит ли это делать? Мы расскажем о преимуществах заказа
            через интернет.
          </p>

          <p className="text_accent">
            Покупать ж/д билеты дёшево можно за 90 суток до отправления поезда.
            Благодаря динамическому ценообразованию цена на билеты в это время
            самая низкая.
          </p>
        </div>
      </section>
      <Features />
      <Reviews />
    </>
  );
};
