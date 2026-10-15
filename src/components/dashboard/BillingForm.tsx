import React from 'react'
import TextField from '../TextField'
import CustomSelect from '../custom-select/custom-select'
import Button from '../Button'

export default function BillingForm() {


  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  return (
    <>
      <form className="grid grid-cols-2 md:gap-5 gap-3 [&_input]:py-3 [&_input]:px-3">
        <div className="col-span-2">
          <TextField name='address1' onChange={() => { }} placeholder='eg.home,office' />
        </div>
        <div className="col-span-2">
          <TextField name='address1' onChange={() => { }} placeholder='Address line 1' />
        </div>
        <div className="col-span-2">
          <TextField name='address2' onChange={() => { }} placeholder='Address line 2' />
        </div>
        <div className="md:col-span-1 col-span-2">
          <CustomSelect
            label=''
            list={options}
            classNamePrefix="select2"
            name={'sortBy'}
            placeholder='Sort By'
            onChange={() => { }}
          />
        </div>
        <div className="md:col-span-1 col-span-2">
          <CustomSelect
            label=''
            list={options}
            classNamePrefix="select2"
            name={'sortBy'}
            placeholder='Sort By'
            onChange={() => { }}
          />
        </div>
        <div className="col-span-2">
          <TextField name='postalCode' onChange={() => { }} placeholder='Postal Code' />
        </div>
        <div className="col-span-2">
          <Button text="Save Address" className="!text-base !capitalize !flex ml-auto" />
        </div>
      </form>
    </>
  )
}
