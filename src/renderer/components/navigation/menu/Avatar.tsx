import hostIcon from '../../../../../assets/icon-host.png';

const Avatar = () => {
  return (
    <img
      src={hostIcon}
      alt="hosticon"
      style={{
        width: 48,
        height: 34,
        objectFit: 'cover',
      }}
    />
  );
};

export default Avatar;
