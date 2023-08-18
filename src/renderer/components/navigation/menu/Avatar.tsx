import { useSelector } from 'react-redux';
import clientIcon from '../../../../../assets/icon-client.png';
import hostIcon from '../../../../../assets/icon-host.png';
import noroleIcon from '../../../../../assets/icon-norole.png';
import bothroleIcon from '../../../../../assets/icon-bothrole.png';
import { RootState } from '../../../redux/store';

const Avatar = () => {
  const isHost =
    useSelector((state: RootState) => state.accountUser.hostAccessToken)
      .length !== 0;
  const isClient =
    useSelector((state: RootState) => state.accountUser.userAccessToken)
      .length !== 0;
  return (
    <img
      src={
        isHost && isClient
          ? bothroleIcon
          : isHost
          ? hostIcon
          : isClient
          ? clientIcon
          : noroleIcon
      }
      alt="Image"
      style={{
        width: 48,
        height: 34,
        objectFit: 'cover',
      }}
    />
  );
};

export default Avatar;
