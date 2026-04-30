import { Search } from 'lucide-react';

const DesktopSearch = () => {
  return (
    <div className=' relative hidden md:block bg-[#F8F8F8A8] rounded-[100px]'>
      <input type="text" placeholder='Search houses, areas, landlords' className=' border-none py-3 pl-13 pr-24 lg:pr-96 focus:outline-[#43A047] rounded-full' />
      <div className=' absolute left-4 bottom-3.5'>
        <Search/>
      </div>
    </div>
  )
}

export default DesktopSearch
