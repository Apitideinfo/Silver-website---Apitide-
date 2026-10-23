import React, { useState } from 'react';
import { Sparkles, Image, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { ImageUploadService } from '../services/ImageUploadService';

export default function BookingForm({
  type = 'consultation', // 'consultation' or 'custom_design'
  onSuccess
}) {
  const { submitting, errors, bookConsultation } = useBooking();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    timeSlot: '',
    description: '',
    preferredType: 'Gold Jewellery',
    categoryType: 'Rings',
    budget: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadStatusMessage, setUploadStatusMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadProgress(true);
      setUploadStatusMessage(`Uploading ${files.length} design sketch(es)...`);
      
      const newUrls = [];
      let successCount = 0;
      
      for (const file of files) {
        try {
          const uploadResult = await ImageUploadService.uploadImage(file);
          newUrls.push(uploadResult.url);
          successCount++;
        } catch (err) {
          console.error("Image upload failed for:", file.name, err);
        }
      }
      
      if (successCount > 0) {
        setUploadedUrls((prev) => [...prev, ...newUrls]);
        setSelectedFiles((prev) => [...prev, ...files.slice(0, successCount)]);
      }
      
      if (successCount === files.length) {
        setUploadStatusMessage(`✓ All ${files.length} images uploaded successfully!`);
      } else {
        setUploadStatusMessage(`✓ Uploaded ${successCount}/${files.length} images successfully.`);
      }
      setUploadProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadProgress) return;

    const payload = {
      ...formData,
      type,
      imageUrl: uploadedUrls[0] || '',
      imageUrls: uploadedUrls,
      createdDate: new Date().toISOString()
    };

    const isSuccess = await bookConsultation(payload);

    if (isSuccess) {
      if (type === 'custom_design') {
        // Open WhatsApp to send message with design url(s) to Admin
        let text = `*New Custom Design Request*\n\n`;
        text += `*Name:* ${formData.name}\n`;
        text += `*Phone:* ${formData.phone}\n`;
        text += `*Category:* ${formData.categoryType}\n`;
        text += `*Budget:* ${formData.budget}\n`;
        text += `*Details:* ${formData.description}\n\n`;
        
        if (uploadedUrls.length > 0) {
          text += `*Reference Image(s):*\n`;
          uploadedUrls.forEach((url, i) => {
            text += `- Image ${i + 1}: ${url}\n`;
          });
        }
        
        const waUrl = `https://wa.me/919451638680?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
      }

      setFormSuccess(true);
      setFormData({
        name: '',
        phone: '',
        date: '',
        timeSlot: '',
        description: '',
        preferredType: 'Gold Jewellery',
        categoryType: 'Rings',
        budget: ''
      });
      setSelectedFiles([]);
      setUploadedUrls([]);
      setUploadStatusMessage('');
    }
  };

  if (formSuccess) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-[#C8A646]/15 flex items-center justify-center mx-auto mb-3 text-[#C8A646]">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h4 className="serif-luxury text-lg font-bold text-gold">Request Submitted Successfully</h4>
        <p className="text-xs text-zinc-500 mt-2">Our showroom representatives will reach out to you via WhatsApp shortly.</p>
        <button
          onClick={() => setFormSuccess(false)}
          className="mt-6 px-5 py-2 bg-gradient-to-r from-[#6B4B2E] to-[#B09A82] text-white text-[10px] uppercase font-bold tracking-widest rounded-lg border-none cursor-pointer"
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs font-semibold text-[#0D2B4E]">
      {errors.global && (
        <p className="text-red-500 text-[10px] font-bold text-center bg-red-50 p-2.5 rounded-xl">
          {errors.global}
        </p>
      )}

      {/* Full Name */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g. Anil Soni"
          className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
          required
        />
        {errors.name && <p className="text-red-500 text-[9px] font-bold">{errors.name}</p>}
      </div>

      {/* WhatsApp Number */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">WhatsApp Contact</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="e.g. +91 97838 43978"
          className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
          required
        />
        {errors.phone && <p className="text-red-500 text-[9px] font-bold">{errors.phone}</p>}
      </div>

      {type === 'consultation' ? (
        <>
          {/* Preferred Date */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Preferred Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
              required
            />
            {errors.date && <p className="text-red-500 text-[9px] font-bold">{errors.date}</p>}
          </div>

          {/* Time Slot */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Time Slot</label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none bg-white"
              required
            >
              <option value="">Select a preferred hour slot</option>
              <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
              <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
              <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
              <option value="06:30 PM - 08:30 PM">06:30 PM - 08:30 PM</option>
            </select>
            {errors.timeSlot && <p className="text-red-500 text-[9px] font-bold">{errors.timeSlot}</p>}
          </div>

          {/* Preferred Categories */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Preferred Collection Type</label>
            <select
              name="preferredType"
              value={formData.preferredType}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none bg-white"
            >
              <option value="Gold Jewellery">Gold Jewellery</option>
              <option value="Diamond Suite">Diamond Suite</option>
              <option value="Polki / Kundan">Polki / Kundan</option>
              <option value="Investment Bullion">Investment Bullion</option>
            </select>
          </div>
        </>
      ) : (
        <>
          {/* Category Type */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Category Type</label>
            <select
              name="categoryType"
              value={formData.categoryType}
              onChange={handleInputChange}
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none bg-white"
              required
            >
              <option value="Rings">Rings</option>
              <option value="Earrings">Earrings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Bangles">Bangles</option>
              <option value="Bracelets">Bracelets</option>
              <option value="Mangalsutras">Mangalsutras</option>
              <option value="Coins">Gold/Silver Coins</option>
              <option value="Other">Other Custom Ornaments</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Target Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="e.g. ₹50,000 or 1.5 Lakhs"
              className="w-full h-11 px-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none"
              required
            />
          </div>

          {/* Design Description */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Bespoke Ornaments Details</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe details: rings size, gold weight preferences, gemstone colorings..."
              className="w-full p-4 rounded-xl border border-solid border-slate-100 focus:border-gold focus:outline-none resize-none font-sans"
              required
            />
          </div>

          {/* Reference sketch file upload */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Design sketch(es) or reference image(s)</label>
            <div className="relative border-2 border-dashed border-zinc-200 hover:border-gold rounded-xl p-4 text-center cursor-pointer transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Image className="w-6 h-6 mx-auto mb-1 text-zinc-400" />
              <span className="text-[10px] text-zinc-400 block">
                {selectedFiles.length > 0 ? `Selected ${selectedFiles.length} file(s)` : 'Choose image file(s) or drag here'}
              </span>
            </div>
            {uploadStatusMessage && (
              <p className={`text-[10px] font-bold mt-1.5 ${
                uploadStatusMessage.startsWith('✓')
                  ? 'text-emerald-600'
                  : uploadStatusMessage.startsWith('❌')
                  ? 'text-red-500'
                  : 'text-amber-500 animate-pulse'
              }`}>
                {uploadStatusMessage}
              </p>
            )}
            
            {/* Gallery Previews of uploaded images */}
            {uploadedUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2.5">
                {uploadedUrls.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-solid border-zinc-100 group bg-zinc-50 flex items-center justify-center shadow-sm">
                    <img src={url} alt={`Sketch ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedUrls(prev => prev.filter((_, i) => i !== idx));
                        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute inset-0 bg-red-600/80 text-white font-extrabold text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-none cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || uploadProgress}
        className="w-full py-3.5 bg-gradient-to-r from-[#6B4B2E] to-[#B09A82] text-white text-xs uppercase font-bold tracking-widest rounded-xl transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 cursor-pointer border-none text-white font-bold"
      >
        {submitting || uploadProgress ? 'Submitting secure request...' : 'Book secure suite consultation'}
      </button>
    </form>
  );
}
