import React, { useEffect } from 'react';
import { fetchUserProfile, getUser } from '../../features/user/userSlice';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { IPhoto, IUserProfileResponse } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { SERVER_URL } from '../../utils/constants';
import styles from './index.module.scss';
import LogoutButton from '../../components/LogoutButton';
import LoadingSpinner from '../../components/LoadingSpinner';


const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const userProfile: IUserProfileResponse | null = useAppSelector(getUser);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (!userProfile) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.profileContainer}>
        <LogoutButton />
      <h1 className={styles.fullName}>{userProfile.fullName}</h1>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSlideChange={() => console.log('slide change')}
        autoplay={{ delay: 2500 }}
      >
        {userProfile.photos.map((photo: IPhoto, index: number) => (
          <SwiperSlide key={index}>
            <img className={styles.img} src={`${SERVER_URL}${photo.url}`} alt={`Photo ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Profile;
