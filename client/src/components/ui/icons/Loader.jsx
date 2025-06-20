import { MutatingDots } from 'react-loader-spinner';

function Loader() {
  return (
    <MutatingDots
      className=" max-w-9"
      visible={true}
      height="100"
      width="100"
      secondaryColor="#7C3AED"
      radius="14.5"
      ariaLabel="mutating-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
      color='#7C3AED' />
  )
}

export default Loader