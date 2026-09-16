// 📍 TRANG HỆ THỐNG QUÁN - Locations Page
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Clock, Navigation, CheckCircle, Wifi, CarFront, Coffee, ArrowRight, Mail, Send } from 'lucide-react'
import Button from '@/components/Button'
import { useLocations } from '@/lib/hooks'
import { formatPhone } from '@/lib/utils'

export default function LocationsPage() {
  const { locations, loading } = useLocations()
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [workshopForm, setWorkshopForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    date: '',
    participants: '1',
    note: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Set initial location when locations load
  if (locations.length > 0 && !selectedLocation) {
    setSelectedLocation(locations[0].id)
    if (!workshopForm.location) {
      setWorkshopForm(prev => ({ ...prev, location: locations[0].id }))
    }
  }

  const currentLocation = locations.find(loc => loc.id === selectedLocation) || locations[0]

  const handleWorkshopSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setWorkshopForm({
        name: '',
        phone: '',
        email: '',
        location: locations[0]?.id || '',
        date: '',
        participants: '1',
        note: ''
      })
      setIsSubmitted(false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <p className="text-text-muted">Đang tải thông tin chi nhánh...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-accent text-white py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
            <MapPin className="w-4 h-4" />
            <span>{locations.length} Chi nhánh tại Việt Nam</span>
          </div>
          
          <h1 className="text-h1 font-bold mb-4">
            Liên hệ & Hệ thống quán
          </h1>
          
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Ghé thăm Modtra để trải nghiệm không gian Zen và thưởng thức matcha Uji nguyên bản. 
            Đặt trước để có chỗ ngồi yên tĩnh nhất.
          </p>
        </div>
      </section>

      {/* Locations List */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`card cursor-pointer transition-all ${
                  selectedLocation === location.id
                    ? 'ring-2 ring-brand-accent shadow-card-hover'
                    : 'hover:shadow-card-hover'
                }`}
                onClick={() => setSelectedLocation(location.id)}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    className="object-cover"
                  />
                  {selectedLocation === location.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-text-main mb-1">
                      {location.name}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {location.address}, {location.district}, {location.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-brand-accent" />
                    <a
                      href={`tel:${location.phone}`}
                      className="text-brand-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {formatPhone(location.phone)}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Clock className="w-4 h-4 text-brand-accent" />
                    <span>{location.hours}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {location.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-brand-accent/10 text-brand-primary rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Location Detail */}
          {currentLocation && (
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Map Placeholder */}
                <div className="relative aspect-video lg:aspect-auto bg-surface-bg">
                  <Image
                    src={currentLocation.image}
                    alt={currentLocation.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {currentLocation.name}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {currentLocation.address}, {currentLocation.district}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="font-bold text-xl text-text-main mb-4">
                      Thông tin chi tiết
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-text-main">Địa chỉ</p>
                          <p className="text-sm text-text-muted">
                            {currentLocation.address}<br />
                            {currentLocation.district}, {currentLocation.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-text-main">Hotline</p>
                          <a
                            href={`tel:${currentLocation.phone}`}
                            className="text-sm text-brand-primary hover:underline"
                          >
                            {formatPhone(currentLocation.phone)}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-text-main">Giờ mở cửa</p>
                          <p className="text-sm text-text-muted">{currentLocation.hours}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="font-medium text-text-main mb-3">Tiện ích</p>
                    <div className="grid grid-cols-2 gap-3">
                      {currentLocation.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm text-text-muted"
                        >
                          <CheckCircle className="w-4 h-4 text-brand-accent flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <a
                      href={`https://maps.google.com/?q=${currentLocation.address}, ${currentLocation.city}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="accent" fullWidth size="sm">
                        <Navigation className="w-4 h-4" />
                        Chỉ đường
                      </Button>
                    </a>
                    <a
                      href={`tel:${currentLocation.phone}`}
                      className="flex-1"
                    >
                      <Button variant="outline" fullWidth size="sm">
                        <Phone className="w-4 h-4" />
                        Gọi ngay
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Amenities Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-h2 font-bold mb-4">
              Vì trải nghiệm của bạn là <span className="text-zen">trọng tâm</span>
            </h2>
            <p className="text-text-muted">
              Mỗi chi nhánh Modtra đều được trang bị đầy đủ tiện nghi để bạn có trải nghiệm tốt nhất
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wifi, title: 'WiFi Tốc Độ Cao', desc: 'Miễn phí & không giới hạn' },
              { icon: CarFront, title: 'Bãi Đỗ Xe Rộng Rãi', desc: 'Ô tô & xe máy miễn phí' },
              { icon: Coffee, title: 'Phòng Trà Đạo Riêng', desc: 'Đặt trước cho nhóm' },
              { icon: CheckCircle, title: 'Không Gian Yên Tĩnh', desc: 'Âm nhạc thiền định' },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-3 p-6 bg-surface-bg rounded-xl">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                  <item.icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-text-main">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Booking Form */}
      <section className="section bg-surface-bg">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Left: Info */}
                <div className="bg-gradient-to-br from-brand-primary to-brand-accent text-white p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Đặt góc an tĩnh hoặc Workshop
                  </h3>
                  <p className="opacity-90 mb-6">
                    Đặt trước để có không gian yên tĩnh nhất, hoặc tham gia workshop 
                    trà đạo cuối tuần để học nghệ thuật đánh chasen.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Workshop Trà Đạo</p>
                        <p className="text-sm opacity-90">
                          Học đánh chasen và văn hóa matcha Nhật Bản
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Góc Thư Giãn Riêng</p>
                        <p className="text-sm opacity-90">
                          Phòng trà đạo riêng tư cho nhóm 4-8 người
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Tư Vấn Miễn Phí</p>
                        <p className="text-sm opacity-90">
                          Về sản phẩm và cách pha matcha tại nhà
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Form */}
                <div className="p-8">
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-brand-accent" />
                      </div>
                      <h4 className="text-xl font-bold text-text-main mb-2">
                        Đã nhận đặt chỗ!
                      </h4>
                      <p className="text-text-muted">
                        Chúng tôi sẽ liên hệ xác nhận trong 24 giờ
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleWorkshopSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-text-main mb-2 block">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          required
                          value={workshopForm.name}
                          onChange={(e) => setWorkshopForm({...workshopForm, name: e.target.value})}
                          placeholder="Nguyễn Văn A"
                          className="input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-text-main mb-2 block">
                            Số điện thoại *
                          </label>
                          <input
                            type="tel"
                            required
                            value={workshopForm.phone}
                            onChange={(e) => setWorkshopForm({...workshopForm, phone: e.target.value})}
                            placeholder="0901234567"
                            className="input"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-text-main mb-2 block">
                            Email
                          </label>
                          <input
                            type="email"
                            value={workshopForm.email}
                            onChange={(e) => setWorkshopForm({...workshopForm, email: e.target.value})}
                            placeholder="email@example.com"
                            className="input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-main mb-2 block">
                          Chọn chi nhánh *
                        </label>
                        <select
                          required
                          value={workshopForm.location}
                          onChange={(e) => setWorkshopForm({...workshopForm, location: e.target.value})}
                          className="input"
                        >
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name} - {loc.district}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-text-main mb-2 block">
                            Ngày mong muốn
                          </label>
                          <input
                            type="date"
                            value={workshopForm.date}
                            onChange={(e) => setWorkshopForm({...workshopForm, date: e.target.value})}
                            className="input"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-text-main mb-2 block">
                            Số người
                          </label>
                          <select
                            value={workshopForm.participants}
                            onChange={(e) => setWorkshopForm({...workshopForm, participants: e.target.value})}
                            className="input"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <option key={num} value={num}>{num} người</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-main mb-2 block">
                          Ghi chú
                        </label>
                        <textarea
                          value={workshopForm.note}
                          onChange={(e) => setWorkshopForm({...workshopForm, note: e.target.value})}
                          placeholder="Yêu cầu đặc biệt hoặc thắc mắc..."
                          rows={3}
                          className="input"
                        />
                      </div>

                      <Button type="submit" fullWidth icon={<Send className="w-4 h-4" />}>
                        Gửi yêu cầu đặt chỗ
                      </Button>

                      <p className="text-xs text-center text-text-muted">
                        Hoặc gọi hotline: <a href="tel:+842839909988" className="text-brand-primary hover:underline">
                          +84 (28) 3990 9988
                        </a>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-brand-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-h2 font-bold mb-4">
            Bạn có câu hỏi về sản phẩm hoặc dịch vụ?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Đội ngũ Modtra luôn sẵn sàng tư vấn và hỗ trợ bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+842839909988">
              <Button size="lg" variant="secondary">
                <Phone className="w-5 h-5" />
                Gọi hotline
              </Button>
            </a>
            <a href="mailto:hello@modtra.vn">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 border-2 border-white text-white">
                <Mail className="w-5 h-5" />
                Gửi email
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
