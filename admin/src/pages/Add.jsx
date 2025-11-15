import React, { useState } from 'react'
import Upload from '../assets/ChatGPT Image Jul 2, 2025, 12_54_17 PM.png';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({token}) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [image5, setImage5] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSubmitHandler = async (e) => {
       e.preventDefault();

       try {
        const formData = new FormData()

        formData.append("name",name)
        formData.append("description", description)
        formData.append("price",price)
        formData.append("category",category)
        formData.append("subCategory",subCategory)
        formData.append("bestseller",bestseller)
        formData.append("sizes",JSON.stringify(sizes))

        image1 && formData.append("image1",image1) 
        image2 && formData.append("image2",image2)
        image3 && formData.append("image3",image3)
        image4 && formData.append("image4",image4)
        image5 && formData.append("image5",image5)

        const response = await axios.post(backendUrl + "/api/product/add", formData, {
          headers: { token,   'Content-Type': 'multipart/form-data' }
        });

        if (response.data.success) {
          toast.success(response.data.message)
          setName('')
          setDescription('')
          setSubCategory('')
          setImage1(false)
          setImage2(false)
          setImage3(false)
          setImage4(false)
          setImage5(false)
          setPrice('')
          setSizes([])
          setCategory('')
          setBestseller(false)
        }
        else{
          toast.error(response.data.message)
        }
       } catch (error) {
        console.log(error);
        toast.error(error.message)
        
       }
  }

  return (
    <form onSubmit={onSubmitHandler} style={{ padding: isMobile ? '0 1rem' : '0' }}> 
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: '1rem'
      }}>
        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Upload Image</p>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem',
          justifyContent: isMobile ? 'space-between' : 'flex-start'
        }}>
          {[1, 2, 3, 4, 5].map((num) => {
            const imageState = [image1, image2, image3, image4, image5][num - 1];
            const setImage = [setImage1, setImage2, setImage3, setImage4, setImage5][num - 1];
            
            return (
              <label key={num} htmlFor={`image${num}`} style={{ 
                margin: "4px",
                cursor: 'pointer',
                width: isMobile ? '45%' : '50%',
                maxWidth: '120px'
              }}>
                <img 
                  style={{ 
                    width: '100%', 
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: imageState ? '2px solid #000' : '1px dashed #ccc'
                  }} 
                  src={!imageState ? Upload : URL.createObjectURL(imageState)} 
                  alt={`Upload ${num}`} 
                />
                <input 
                  onChange={(e) => setImage(e.target.files[0])} 
                  type="file" 
                  id={`image${num}`} 
                  hidden 
                />
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Product name</p>
        <input
          onChange={(e) => setName(e.target.value)} 
          value={name}
          style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '300px',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}
          type="text" 
          placeholder='Type product name here' 
          required 
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)} 
          value={description}
          style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '300px',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            minHeight: '100px',
            resize: 'vertical'
          }}
          placeholder='Write product description here' 
          required 
        />
      </div>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '1rem' : '2rem',
        width: '100%',
        marginBottom: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Product category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          >
            <option value="" disabled>Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Tool">Tool</option>
            <option value="Eats">Eats</option>
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Sub category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          >
            <option value="" disabled>Select Subcategory</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Dress">Dress</option>
            <option value="Accessory">Accessory</option>
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)} 
            value={price}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }} 
            type="Number" 
            placeholder='25' 
            required
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Product Sizes</p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div 
              key={size} 
              onClick={() => setSizes(prev => 
                prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
              )}
              style={{ cursor: 'pointer' }}
            >
              <p style={{
                backgroundColor: sizes.includes(size) ? "#fce7f3" : "#e2e8f0",
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                margin: 0,
                minWidth: '40px',
                textAlign: 'center',
                transition: 'background-color 0.2s ease'
              }}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <input 
          onChange={() => setBestseller(prev => !prev)}   
          checked={bestseller}
          type="checkbox" 
          id='bestseller' 
          style={{ cursor: 'pointer' }}
        />
        <label style={{ cursor: 'pointer' }} htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button 
        type='submit' 
        style={{
          backgroundColor: '#000000',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          borderRadius: '20px',
          color: 'white',
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          border: 'none',
          outline: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: isMobile ? '100%' : 'auto',
          ':hover': {
            backgroundColor: '#333333',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
          }
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#333333';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#000000';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        ADD PRODUCT
      </button>
    </form>
  )
}

export default Add;