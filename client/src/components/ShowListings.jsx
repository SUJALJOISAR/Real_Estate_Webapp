import axios from 'axios';
import {useState,useEffect} from 'react'
import { toast } from 'react-toastify';


const ShowListings = () => {
    const [listings, setListings] = useState([]);

    useEffect(()=>{
        const fetchListings = async () =>{
            try {
                const response = await axios.get("/listing/getlistings");
                if(response.data.success){
                    setListings(response.data.listings);
                    toast.success("Listings Fetched successfully");
                }else{
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching listings:", error);
                toast.error("Could not fetch listings.");   
            }
        }

        fetchListings();
    },[]);

    const handleEdit = ()=>{
        
    }

    const handleDelete = async (id)=>{
        try {
            const response = await axios.delete(`/listing/deletelisting/${id}`);
            if(response.data.success){
                setListings(prevListings => prevListings.filter(listing => listing.id !== id));
                toast.success(response.data.message);
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting listing:", error);
            toast.error("Could not delete listing.");
        }
    }

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
            <h3 className="text-lg font-bold mb-4">Your Listings</h3>
            {listings.length > 0 ? (
                <ul className="space-y-4">
                    {listings.map((listing) => (
                        <li key={listing.id} className="flex items-center justify-between border p-4 rounded-md">
                            <div className="flex items-center">
                                <img
                                    src={listing.image}
                                    // alt={listing.name}
                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                />
                                <span>{listing.name}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(listing.id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(listing.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No listings available.</p>
            )}
        </div>
  )
}

export default ShowListings
