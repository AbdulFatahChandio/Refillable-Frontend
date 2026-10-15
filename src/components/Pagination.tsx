"use client";

import React from 'react'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import ReactPaginate from 'react-paginate';
import { useMediaQuery } from 'react-responsive';


interface IPaginatorInfo {
  total?: number;
  lastPage?: number;
  currentPage: number;
  perPage?: number;
  totalPages: number;
  prev?: number;
  next?: number;
  onPageChange?: (event: { selected: number }) => void;
}



export default function Pagination({ totalPages, currentPage, onPageChange }: IPaginatorInfo) {

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div>
      <ReactPaginate
        className='flex justify-center gap-3 [&_a]:w-10 [&_a]:cursor-pointer [&_a]:h-10 [&_a]:flex [&_a]:items-center border-secondary [&_a]:justify-center [&_a]:text-brown [&_a]:border [&_a]:rounded-full [&_a]:shrink-0'
        breakLabel="..."
        forcePage={currentPage - 1}
        nextLabel={<GoChevronRight size={22} className='rtl:rotate-180' />}
        onPageChange={onPageChange}
        pageRangeDisplayed={isMobile ? .5 : 3}
        marginPagesDisplayed={isMobile ? .5 : 3}
        pageCount={totalPages}
        previousLabel={<GoChevronLeft size={22} className='rtl:rotate-180' />}
        renderOnZeroPageCount={null}
        activeLinkClassName='bg-brown !text-secondary !border-brown'
      />
    </div>
  )
}
