import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateListing = () => {
    const [files,setFiles]=useState([]);
    const [imagePreviews,setImagePreviews]=useState([]);
    const navigate=useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        type: { sell: false, rent: false },
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        parking: false,
        furnished: false,
        images: [],
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'type') {
            //handle sell/rent checkboxes
            setFormData((prevState) => ({
                ...prevState,
                type: { ...prevState.type, [value]: checked },
            }));
        } else {
            const newValue = type === "checkbox" ? checked : value;
            setFormData({ ...formData, [name]: newValue });
        }
    }

    const handleFileChange = (e)=>{
        const selectedFiles = Array.from(e.target.files);

        //preview images
        const previews = selectedFiles.map((file)=>URL.createObjectURL(file));
        setImagePreviews(previews);

        //add images to formdata
        setFiles(selectedFiles);
        setFormData((prevState)=>({
            ...prevState,
            images: selectedFiles,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("type", JSON.stringify(formData.type));
        formDataToSend.append("offer", formData.offer ? 1: 0);
        formDataToSend.append("bedrooms", formData.bedrooms);
        formDataToSend.append("bathrooms", formData.bathrooms);
        formDataToSend.append("regularPrice", formData.regularPrice);
        formDataToSend.append("discountPrice", formData.discountPrice);
        formDataToSend.append("parking", formData.parking ? 1: 0);
        formDataToSend.append("furnished", formData.furnished ? 1 : 0);

        //Append images
        files.forEach((file) => {
            formDataToSend.append("images",file);
        });

        try {
            const response=await axios.post("/listing/createlisting",formDataToSend,
                {headers: {'Content-Type': 'multipart/form-data'} }
            );
            console.log("Listing Created:",response.data);
            toast.success("Listing Created Successfully");
            navigate('/updateProfile');
        } catch (error) {
            console.error("Error creating listing:", error);
            toast.error("Failed to create listing. Please try again.");
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Create a Listing</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="type"
                            value="sell"
                            checked={formData.type.sell}
                            onChange={handleInputChange}
                        />
                        <span className="ml-2">Sell</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="type"
                            value="rent"
                            checked={formData.type.rent}
                            onChange={handleInputChange}
                        />
                        <span className="ml-2">Rent</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="parking"
                            checked={formData.parking}
                            onChange={handleInputChange}
                        />
                        <span className="ml-2">Parking Spot</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="furnished"
                            checked={formData.furnished}
                            onChange={handleInputChange}
                        />
                        <span className="ml-2">Furnished</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="offer"
                            checked={formData.offer}
                            onChange={handleInputChange}
                        />
                        <span className="ml-2">Offer</span>
                    </label>
                </div>
                <div className="flex items-center space-x-4">
                    <div>
                        <label className="block font-medium mb-1">Beds</label>
                        <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Baths</label>
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block font-medium mb-1">Regular Price (₹/Month)</label>
                    <input
                        type="number"
                        name="regularPrice"
                        value={formData.regularPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                {formData.offer && (
                    <div>
                        <label className="block font-medium mb-1">Discount Price (₹/Month)</label>
                        <input
                            type="number"
                            name="discountPrice"
                            value={formData.discountPrice}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                )}
                <div>
                    <label className="block font-medium mb-1">Images (Max 6)</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {/* Image Previews */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                        {imagePreviews.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt="preview"
                                className="h-20 w-20 object-cover rounded-md"
                            />
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                >
                    Create Listing
                </button>
            </form>
        </div>
    );
};

export default CreateListing
