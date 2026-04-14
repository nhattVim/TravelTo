import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getTours, getTourDetail } from '@/lib/api/public';

// Bypass SSL certificate errors in local development proxy
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: `Bạn là trợ lý ảo AI cao cấp của hệ thống du lịch TravelTo.
Bạn CHỈ tư vấn và trả lời các câu hỏi liên quan đến du lịch, đặt tour, thông tin điểm đến, phương tiện di chuyển, văn hóa và dịch vụ của TravelTo.
Vui lòng chủ động sử dụng các công cụ (tools) được cung cấp để tra cứu dữ liệu tour từ hệ thống Backend khi người dùng hỏi để cung cấp thông tin chính xác nhất.
Nếu người dùng hỏi về các chủ đề KHÔNG liên quan đến du lịch (như lập trình, toán học, chính trị, y tế, v.v.), hãy từ chối lịch sự và hướng họ trở lại với chủ đề du lịch.
Bạn phải luôn giữ thái độ lịch sự, thân thiện, chuyên nghiệp và nhiệt tình. Câu trả lời của bạn nên được định dạng đẹp mắt bằng markdown (in đậm, danh sách) nếu cần thiết.`,
      messages,
      temperature: 0.7,
      maxSteps: 3,
      tools: {
        searchTours: tool({
          description: "Tìm kiếm hệ thống để lấy danh sách các tour du lịch dựa trên địa điểm đi/về hoặc tầm giá.",
          parameters: z.object({
            destinationLocation: z.string().optional().describe('Điểm đến của tour (VD: Đà Nẵng, Phú Quốc, Hà Nội)'),
            departureLocation: z.string().optional().describe('Điểm khởi hành của tour (VD: TP. Hồ Chí Minh)'),
            minPrice: z.number().optional().describe('Tầm giá tối thiểu'),
            maxPrice: z.number().optional().describe('Tầm giá tối đa'),
          }),
          execute: async (params) => {
            try {
              const res = await getTours(params);
              return { tours: res.items.slice(0, 5) }; // Trả về object thay vì array để tránh lỗi Proto field
            } catch {
              return { error: 'Gặp sự cố khi lấy danh sách tour từ hệ thống.' };
            }
          }
        }),
        getTourDetail: tool({
          description: "Lấy thông tin chi tiết đầy đủ của một tour bao gồm lịch trình, hoạt động giải trí dựa vào ID của tour.",
          parameters: z.object({
            id: z.number().describe('ID của tour du lịch (ví dụ: 1)'),
          }),
          execute: async ({ id }) => {
            try {
              return await getTourDetail(id);
            } catch {
              return { error: 'Không thể lấy thông tin chi tiết của tour này.' };
            }
          }
        })
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Lỗi khi gọi AI API:', error);
    return new Response('Có lỗi xảy ra khi kết nối tới hệ thống AI.', { status: 500 });
  }
}
