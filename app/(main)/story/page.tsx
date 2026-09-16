// 📖 TRANG CÂU CHUYỆN MODTRA - Story Page
import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Heart, Users, Award, ArrowRight, Quote, Sparkles } from 'lucide-react'
import Button from '@/components/Button'

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary via-brand-accent to-brand-primary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Heart className="w-4 h-4" />
              <span>Chế thẩm Modtra</span>
            </div>
            
            <h1 className="text-h1 font-bold mb-6 leading-tight">
              Chế thẩm Modtra — <span className="font-serif italic">Chỉm đặng chặn mội yên</span> giữa lòng phố thị
            </h1>
            
            <p className="text-xl leading-relaxed opacity-90 mb-8">
              Từ hành trình từ những đồi trà Uji nghìn năm đến ly matcha tĩnh lặng nơi phố thị. 
              Modtra không chỉ là thương hiệu đồ uống, mà là không gian để bạn <span className="font-serif italic">chậm lại</span>, 
              thở sâu và tìm về với chính mình.
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/menu">
                <Button size="lg" variant="secondary">
                  Khám phá thực đơn
                </Button>
              </Link>
              <Link href="/locations">
                <Button size="lg" className="bg-white/10 hover:bg-white/20 border-2 border-white text-white">
                  Ghé thăm quán
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card-hover">
                <Image
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800"
                  alt="Modtra tea ceremony"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-brand-accent/20 rounded-full blur-3xl -z-10" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
                  Nguồn Gốc
                </p>
                <h2 className="text-h2 font-bold mb-4">
                  Hành trình từ đồi trà <span className="text-zen">Uji nghìn năm</span> đến ly matcha tĩnh lặng
                </h2>
              </div>

              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Năm 2020, trong chuyến thăm Kyoto, chúng tôi đã được trải nghiệm nghi thức trà đạo tại 
                  một ngôi chùa cổ kính nhìn ra vườn trà Uji xanh mướt. Đó là khoảnh khắc mà thời gian như ngưng lại, 
                  chỉ còn tiếng gió rì rào qua lá tre và hương matcha thoang thoảng.
                </p>
                <p>
                  Chúng tôi nhận ra rằng, giữa nhịp sống hối hả của Sài Gòn, nhiều người đang khao khát 
                  một góc nhỏ để <span className="text-zen font-semibold">chậm lại, thở sâu và tìm về</span>. 
                  Từ đó, Modtra ra đời với sứ mệnh mang triết lý <span className="font-serif italic">Slow Living</span> 
                  và tinh hoa matcha Uji nguyên bản đến gần hơn với mọi người.
                </p>
                <p>
                  Mỗi ly matcha tại Modtra không chỉ là thức uống, mà là lời mời bạn dừng chân, 
                  thưởng thức từng ngụm trà và cảm nhận sự yên bình trong tâm hồn.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center">
                  <Quote className="w-8 h-8 text-brand-primary" />
                </div>
                <div>
                  <p className="font-serif italic text-lg text-brand-primary">
                    "Chậm lại để sống trọn vẹn hơn"
                  </p>
                  <p className="text-sm text-text-muted">Triết lý Modtra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-surface-bg">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
              Hành Trình 3 Giai Đoạn
            </p>
            <h2 className="text-h2 font-bold mb-4">
              Từ búp trà Uji đến <span className="text-zen">ly matcha hoàn hảo</span>
            </h2>
            <p className="text-text-muted leading-relaxed">
              Mỗi bước trong quy trình đều được thực hiện với tâm huyết và tôn trọng nghệ thuật trà đạo Nhật Bản
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Che Bóng Giàn Tana',
                subtitle: '30 ngày trước thu hoạch',
                desc: 'Giàn rơm che kín ruộng trà để tăng hàm lượng L-Theanine và Chlorophyll, tạo nên vị umami đặc trưng và màu xanh biếc tự nhiên',
                image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?w=600',
                icon: Leaf
              },
              {
                step: '02',
                title: 'Thu Hái Búp Non',
                subtitle: 'First Flush tháng 5',
                desc: 'Chỉ chọn 2 lá non đầu tiên của mỗi cành trà vào đầu tháng 5, khi búp trà đạt độ mềm mại và hương thơm cao nhất trong năm',
                image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600',
                icon: Sparkles
              },
              {
                step: '03',
                title: 'Nghiền Cối Đá Granit',
                subtitle: '18g mỗi giờ',
                desc: 'Quy trình siêu chậm bằng cối đá truyền thống, nghiền 18g/giờ để giữ trọn hương thơm tinh tế và kết cấu mịn như phấn tơ',
                image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600',
                icon: Award
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-card group-hover:shadow-card-hover transition-shadow">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-brand-primary shadow-card">
                    {item.step}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-text-main">{item.title}</h3>
                      <p className="text-xs text-brand-accent font-medium">{item.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Commitments */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
              Cam Kết Của Modtra
            </p>
            <h2 className="text-h2 font-bold mb-4">
              3 Nguyên Tắc <span className="text-zen">không thể thỏa hiệp</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: '100% Không Hương Liệu',
                desc: 'Tuyệt đối không sử dụng bột màu, hương liệu tổng hợp hay chất bảo quản. Hương vị từ thiên nhiên nguyên bản.',
                color: 'from-green-500 to-brand-accent'
              },
              {
                icon: Heart,
                title: 'Tôn Vinh Sữa Hạt Tươi',
                desc: 'Sữa yến mạch, hạnh nhân, dừa đều được làm tươi mỗi ngày. Đường hoa dừa thay vì đường tinh luyện.',
                color: 'from-amber-500 to-orange-500'
              },
              {
                icon: Award,
                title: 'Chuẩn Mực Micro-Foam',
                desc: 'Lớp foam matcha được đánh chasen theo nghi thức Nhật, tạo kết cấu mịn màng và hương vị cân bằng hoàn hảo.',
                color: 'from-brand-primary to-brand-accent'
              }
            ].map((item, index) => (
              <div key={index} className="card group hover:scale-105 transition-transform">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-main mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-text-muted text-center leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slow Living Philosophy */}
      <section className="section bg-gradient-to-br from-surface-bg to-brand-primary/5">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
                  Triết Lý Slow Living
                </p>
                <h2 className="text-h2 font-bold mb-4">
                  Trải nghiệm <span className="text-zen">thiền trà</span> và không gian thư thái
                </h2>
              </div>

              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Trong thế giới hiện đại đầy vội vã, Modtra mong muốn tạo ra một <span className="font-serif italic text-brand-primary">oasis</span> 
                  nơi bạn có thể tạm gác lại công việc, điện thoại và mọi lo toan để chỉ tập trung vào khoảnh khắc hiện tại.
                </p>
                <p>
                  Không gian Wabi-Sabi tối giản với ánh sáng tự nhiên, cây xanh và âm nhạc thiền định êm dịu 
                  sẽ giúp bạn thư giãn sâu và tái tạo năng lượng. Mỗi góc của Modtra được thiết kế để khuyến khích 
                  sự <span className="font-semibold text-brand-primary">chậm lại, quan sát và cảm nhận</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-xl">
                  <p className="text-3xl font-bold text-brand-primary mb-1">Zen</p>
                  <p className="text-sm text-text-muted">Phòng trà đạo riêng tư</p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <p className="text-3xl font-bold text-brand-primary mb-1">100%</p>
                  <p className="text-sm text-text-muted">Âm nhạc thiền định</p>
                </div>
              </div>

              <Link href="/locations">
                <Button variant="accent" icon={<ArrowRight className="w-5 h-5" />}>
                  Đặt góc thư giãn riêng
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600"
                    alt="Zen space"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600"
                    alt="Tea ceremony"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600"
                    alt="Matcha preparation"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src="https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600"
                    alt="Interior"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Team */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-brand-accent font-medium mb-3 uppercase tracking-wide text-sm">
              Cộng Đồng Modtra
            </p>
            <h2 className="text-h2 font-bold mb-4">
              Không chỉ là thương hiệu, mà là <span className="text-zen">gia đình</span>
            </h2>
            <p className="text-text-muted leading-relaxed">
              Từ đội ngũ barista được đào tạo bài bản về trà đạo Nhật Bản, đến cộng đồng yêu thích 
              matcha và slow living. Chúng tôi cùng nhau chia sẻ và lan tỏa lối sống chậm lại.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Workshop Trà Đạo', desc: 'Lớp học đánh chasen và văn hóa matcha mỗi cuối tuần' },
              { icon: Heart, title: 'Cộng Đồng Yêu Trà', desc: 'Hơn 10.000 thành viên chia sẻ và kết nối' },
              { icon: Leaf, title: 'Chương Trình Xanh', desc: 'Thu hồi chai thủy tinh và giảm thiểu rác thải' },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-3 p-6 bg-surface-bg rounded-2xl">
                <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto">
                  <item.icon className="w-7 h-7 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg text-text-main">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-brand-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-h2 font-bold mb-4">
            Sẵn sàng cho một ngày mới tươi mát cùng <span className="font-serif italic">Modtra</span>?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Ghé thăm Modtra để trải nghiệm không gian Zen và thưởng thức matcha Uji nguyên bản
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" variant="secondary">
                Đặt nước ngay
              </Button>
            </Link>
            <Link href="/locations">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 border-2 border-white text-white">
                Xem địa chỉ quán
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
