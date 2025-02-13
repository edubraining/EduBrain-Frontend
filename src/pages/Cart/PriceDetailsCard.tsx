import PrimaryButton from '../../components/buttons/PrimaryButton'
import arrowLeftAlt from '../../assets/icons/arrow_left_alt.svg'
import { getPriceAfterDiscount } from '../../utils/getPriceAfterDiscount'
import { type ICourse } from '../../types/course.types'
import { useSelector } from 'react-redux'
import { type RootState } from '../../store'
import { useNavigate } from 'react-router-dom'

const PriceDetailsCard = ({ items }: { items: ICourse[] }): JSX.Element => {
  const { cartItems } = useSelector((state: RootState) => state.cartItems)

  const navigate = useNavigate();
  return (
    <div className="w-full xl:w-[436px] border rounded-2xl bg-[#0A0A0A] border-[#2F2F31] p-8 flex flex-col gap-6 h-fit text-white">
       <div className="flex flex-col items-center gap-1">
          <h3 className="h3 text-red-900">
            ₹
            {cartItems.reduce(
              (acc, item) =>
                acc +
                getPriceAfterDiscount(item.basePrice, item.discountedPercent),
              0
            )}
          </h3>
          <span>Total</span>
        </div>
      <PrimaryButton  onClick={() => { navigate('/'); }}   className="flex gap-4 items-center justify-center font-semibold text-neutral-100">
        <span>Checkout</span>
        <img src={arrowLeftAlt} alt="arrow-left" />
      </PrimaryButton>
    </div>



    
  )
}
export default PriceDetailsCard
