import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  name: z.string().trim().min(2, 'Vui lòng nhập họ tên (tối thiểu 2 ký tự).').max(80, 'Họ tên quá dài.'),
  email: z.union([
    z.string().trim().email('Email không hợp lệ.'),
    z.literal(''),
  ]).optional().transform((v) => (v ?? '')),
  content: z.string().trim().min(10, 'Vui lòng nhập nội dung (tối thiểu 10 ký tự).').max(2000, 'Nội dung quá dài.'),
})

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const defaultValues = useMemo(() => ({ name: '', email: '', content: '' }), [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  })

  const onSubmit = async (values) => {
    // TODO: nối API tiếp nhận phản ánh/kiến nghị
    // await api.post('/api/public/feedback', values)
    void values
    setSent(true)
    reset(defaultValues)
  }

  return (
    <div className="container py-4 py-lg-5">
      <Helmet>
        <title>Liên hệ | Xã Tân Thuận Đông</title>
        <meta name="description" content="Thông tin liên hệ UBND Xã Tân Thuận Đông và kênh tiếp nhận phản ánh, kiến nghị của người dân." />
      </Helmet>

      <div className="mb-3" data-aos="fade-up">
        <div className="badge text-bg-primary">Liên hệ</div>
        <h1 className="h2 fw-bold mb-1">Thông tin UBND & tiếp nhận phản ánh</h1>
        <div className="text-muted">
          Người dân có thể liên hệ trực tiếp hoặc gửi phản ánh/kiến nghị để UBND xã tiếp nhận và xử lý.
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5" data-aos="fade-up">
          <div className="p-4 bg-white border rounded-4">
            <div className="fw-bold mb-2">UBND Xã Tân Thuận Đông</div>
            <div className="text-muted">
              <div><b>Địa chỉ:</b> Số 39, đường số 1, xã Tân Thuận Đông, thành phố Cao Lãnh, tỉnh Đồng Tháp</div>
              <div><b>Điện thoại:</b> 02773898112</div>
              <div><b>Email:</b> <a href="mailto:tanthuandongxa@gmail.com">tanthuandongxa@gmail.com</a></div>
              <div><b>Website:</b> <a href="https://xatanthuandong.tpcaolanh.dongthap.gov.vn" target="_blank" rel="noreferrer">xatanthuandong.tpcaolanh.dongthap.gov.vn</a></div>
              <div className="small mt-2">Giờ làm việc: Thứ 2–Thứ 6 (sáng/chiều)</div>
            </div>
          </div>

          <div className="p-4 bg-white border rounded-4 mt-4" data-aos="fade-up" data-aos-delay="120">
            <div className="fw-bold mb-2">Gửi phản ánh/kiến nghị</div>
            <div className="small text-muted mb-2">
              Vui lòng mô tả rõ nội dung, địa điểm và thông tin liên hệ để thuận tiện xác minh.
            </div>

            <form className="d-flex flex-column gap-2" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <input
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Họ tên"
                  autoComplete="name"
                  {...register('name')}
                />
                {errors.name ? <div className="invalid-feedback">{errors.name.message}</div> : null}
              </div>

              <div>
                <input
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email (không bắt buộc)"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email ? <div className="invalid-feedback">{errors.email.message}</div> : null}
              </div>

              <div>
                <textarea
                  className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                  rows="5"
                  placeholder="Nội dung phản ánh/kiến nghị"
                  {...register('content')}
                />
                {errors.content ? <div className="invalid-feedback">{errors.content.message}</div> : null}
              </div>

              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi'}
              </button>

              {sent ? <div className="small text-muted">Đã gửi (demo). Có thể nối API tiếp nhận phản ánh sau.</div> : null}
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7" data-aos="fade-left">
          <div className="p-4 bg-white border rounded-4">
            <div className="fw-bold mb-2">Bản đồ</div>
            <div className="ratio ratio-16x9 rounded-4 overflow-hidden">
              <iframe
                title="Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                // Dùng định dạng embed chuẩn để tránh bị chuyển hướng sang trang Google Maps (có thể yêu cầu đăng nhập)
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sUBND%20X%C3%A3%20T%C3%A2n%20Thu%E1%BA%ADn%20%C4%90%C3%B4ng!5e0!3m2!1svi!2s!4v1"
                allowFullScreen
              />
            </div>
            <div className="text-muted small mt-2">Nếu cần chính xác, thay link maps theo địa chỉ UBND xã.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
