import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import { Header } from 'components/Header';

import { reviews } from './constants';

const reviewList = reviews.reduce((acc, curr, i) => {
  if (!(i % 2)) {
    acc.push([curr]);
  } else {
    const lastIndex = acc.length - 1;
    acc[lastIndex].push(curr);
  }
  return acc;
}, []);

export const Reviews = () => {
  return (
    <section className="reviews" id="reviews">
      <Header size="m">Отзывы</Header>
      <Carousel
        autoPlay
        interval={5000}
        infiniteLoop
        showStatus={false}
        showArrows={false}
        showThumbs={false}
      >
        {reviewList.map((reviews, i) => (
          <ul key={i} className="reviews__list">
            {reviews.map((review, j) => (
              <ReviewItem key={j} {...review} />
            ))}
          </ul>
        ))}
      </Carousel>
    </section>
  );
};

const ReviewItem = ({ title, content, img }) => {
  return (
    <li className="reviews__item">
      <div className="review__image_wrapper">
        <img className="review__image" src={img} alt="Аватар автора отзыва" />
      </div>
      <div className="review__content">
        <h5 className="review__header header_size_xs">{title}</h5>
        <div className="review__text">{content}</div>
      </div>
    </li>
  );
};
