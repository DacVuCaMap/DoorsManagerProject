// import FireTestTotal from '@/Model/FireTestTotal'
// import React from 'react'

// type Props = {
//     fireTestTotal:FireTestTotal,
    
// }
// export default function CreateBaoGiaFireTestTotal() {
//     return (
//         <div className='text-sm'>
//             <div className='mb-2'>
//                 <span className='border-b border-gray-500 text-gray-400'>{props.totalGroup.name}</span>
//             </div>
//             {props.totalGroup.totalItem.map((item: TotalItem, index: number) =>
//                 <div key={index} className='bg-gray-900 w-full flex flex-row hover:bg-gray-800'>
//                     <div className='w-1/12 p-2 flex text-center font-bold justify-center items-center'>{props.listReport.length + 1 + index}</div>
//                     <div className='w-11/12 flex flex-row items-center py-1'>
//                         <div className='w-4/12 p-2 text-center font-bold'>
//                             <input
//                                 type="text"
//                                 className='outline-none  px-2 py-1 w-full bg-transparent border-b border-gray-300'
//                                 value={item.acs.name}
//                                 onChange={e => handleChangeInputInsideAcs(e.target.value, "name", item, index)}
//                             />
//                         </div>
//                         <div className='w-1/12 p-2 text-center font-bold'>{item.acs.code}</div>
//                         <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
//                         </div>
//                         <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
//                             <div className='flex flex-row space-x-2'>
//                                 <span className='w-1/2'></span>
//                                 <span className='w-1/2'>
//                                     {formatNumberFixed3(item.acs.totalQuantity)}
//                                 </span>
//                             </div>
//                         </div>
//                         <div className='w-1/12 p-2 text-center font-bold'>
//                             <input
//                                 type="text"
//                                 className='text-center outline-none py-1 w-full bg-transparent border-b border-gray-300'
//                                 value={formatNumberToDot(item.acs.price)}
//                                 onChange={e => handleChangeInputInsideAcs(e.target.value, "price", item, index)}
//                             />
//                         </div>
//                         <div className='w-1/12 p-2 text-center font-bold'>
//                             {formatNumberToDot(item.acs.price * item.acs.totalQuantity)}
//                         </div>
//                         <div className='w-1/12 p-2 text-center font-bold'></div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }
