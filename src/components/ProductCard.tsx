import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
  isPrime?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({ id, title, price, rating, image, isPrime = false }) => {
  return (
    <div className="flex flex-col bg-white z-30 p-4 rounded-md transition-all duration-200 ease-in-out hover:shadow-lg">
      <Link href={`/product/${id}`} className="cursor-pointer">
        <div className="relative h-52 w-full mb-3">
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </Link>

      <Link href={`/product/${id}`} className="cursor-pointer">
        <h4 className="my-2 text-sm text-gray-800 line-clamp-2 hover:text-amazon-orange">{title}</h4>
      </Link>
      
      <div className="flex">
        {Array(rating)
          .fill(0)
          .map((_, i) => (
            <svg 
              key={i}
              className="h-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        <span className="text-xs text-blue-500 ml-1">({Math.floor(Math.random() * 1000) + 100})</span>
      </div>

      <div className="mb-1 mt-1">
        <p className="text-lg font-semibold">
          <span className="align-top text-xs">$</span>
          {Math.floor(price)}
          <span className="text-sm">{(price % 1).toFixed(2).substring(1)}</span>
        </p>
        {price > 25 && (
          <p className="text-xs text-gray-500">or ${(price / 6).toFixed(2)}/month for 6 months</p>
        )}
      </div>

      <div className="mb-2">
        <p className="text-xs text-gray-500">Eligible for FREE Shipping</p>
        {isPrime && (
          <div className="flex items-center space-x-1">
            <div className="bg-amazon-blue text-white text-xs px-1 rounded">
              <span className="font-bold">prime</span>
            </div>
            <p className="text-xs text-gray-500">FREE Delivery Tomorrow</p>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button 
          className="mt-auto flex-grow button text-xs md:text-sm bg-amazon-yellow border border-yellow-300 rounded-full py-1 px-2 text-black font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 active:from-yellow-500 hover:bg-yellow-400"
        >
          Add to Cart
        </button>
        <button 
          className="mt-auto button text-xs md:text-sm bg-amazon-orange border border-orange-300 rounded-full py-1 px-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 active:from-orange-500 hover:bg-orange-600"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;