import { Search } from 'lucide-react';

const DesktopSearch = () => {
  return (
    <div className=' relative hidden md:flex pl-4 bg-[#F8F8F8A8] rounded-lg'>
      <input type="text" placeholder='Search Listings' className=' border-none w-full outline-none py-3 pl-7 pr-14' />
      <div className=' absolute bottom-3.5'>
        <Search/>
      </div>
    </div>
  )
}

export default DesktopSearch
