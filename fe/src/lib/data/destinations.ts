export type Destination = {
  id: string;
  slug: string;
  name: string;
  province: string;
  shortDescription: string;
  markdownContent: string;
  imageUrl: string;
};

export const destinationsList: Destination[] = [
  {
    id: "dest-1",
    slug: "sa-pa",
    name: "Sa Pa, Lào Cai",
    province: "Tỉnh Lào Cai",
    shortDescription: "Thành phố trong sương với những thửa ruộng bậc thang kỳ vĩ và bản sắc văn hóa vùng cao độc đáo.",
    imageUrl: "/destinations/sapa.png",
    markdownContent: `
# Khám Phá Sa Pa - Nơi Đất Trời Giao Thoa

Sa Pa là một thị xã vùng cao thuộc tỉnh Lào Cai, nằm ở phía Tây Bắc Việt Nam. Nơi đây mang một vẻ đẹp lãng mạn, huyền bí của mây ngàn gió núi. Thời tiết Sa Pa quanh năm mát mẻ, chia làm 4 mùa rõ rệt ngay trong một ngày, tạo nên trải nghiệm cực kỳ thú vị cho du khách. 

---

## Những Trải Nghiệm Tuyệt Vời Không Thể Bỏ Lỡ

Dù bạn đến Sa Pa vào mùa nào, "Thành phố mây" này luôn có những điều kỳ diệu chờ đón:

1. **Chinh phục đỉnh Fansipan:** Được mệnh danh là "Nóc nhà Đông Dương" với độ cao 3.143m. Hành trình lên đỉnh nay đã trở nên dễ dàng hơn nhờ hệ thống cáp treo hiện đại, nhưng cảm giác đứng trên đỉnh cao, thu vào tầm mắt cả một biển mây vẫn luôn là khoảnh khắc choáng ngợp nhất.
2. **Khám phá bản Cát Cát:** Một bản làng cổ của người H'Mông, nép mình dưới chân núi Hoàng Liên Sơn. Nơi đây quyến rũ bởi những nếp nhà gỗ truyền thống, nương ngô xanh biếc và những con suối mộng mơ.
3. **Thưởng thức cảnh sắc Ruộng Bậc Thang:** Những thửa ruộng bậc thang quanh co như những nấc thang lên thiêng đường. Đặc biệt vào mùa lúa chín (tháng 9-10), cả thung lũng Mường Hoa như khoác lên mình chiếc áo vàng rực rỡ.
4. **Chợ tình Sa Pa và văn hoá đồng bào Mông, Dao:** Khám phá những làn điệu dân ca, tiếng khèn và văn hoá truyền thống đầy màu sắc của các dân tộc anh em.

---

## Ẩm Thực Vùng Cao Đặc Sắc

Không chỉ có cảnh sắc, ẩm thực Sa Pa mang một phong vị núi rừng làm say đắm bất kỳ ai:

- **Lợn cắp nách nướng:** Gà bản, lợn cắp nách quay trên than hồng giòn rụm.
- **Thắng cố:** Món ăn tâm hồn của người vùng cao, ăn cùng mèn mén và nhâm nhi ly rượu táo mèo thơm nồng trong đêm sương giá lạnh.
- **Rau mầm đá, su su & cá suối nướng:** Những nguyên liệu dân dã nhưng cực kỳ đưa cơm.

---

> *"Sa Pa cứ lặng lẽ, nên thơ, gieo vào lòng người lữ khách những nhung nhớ khó phai. Nếu bạn chưa từng đến Sa Pa, hãy một lần xách balo lên và đi!"*
    `,
  },
  {
    id: "dest-2",
    slug: "vinh-ha-long",
    name: "Vịnh Hạ Long",
    province: "Tỉnh Quảng Ninh",
    shortDescription: "Di sản thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi nhô lên từ mặt nước xanh ngọc bích.",
    imageUrl: "/destinations/halong.png",
    markdownContent: `
# Vịnh Hạ Long - Tuyệt Tác Kiến Trúc Của Mẹ Thiên Nhiên

Vịnh Hạ Long (Quảng Ninh) hai lần được UNESCO vinh danh là **Di sản Thiên nhiên Thế giới**. Chẳng cần nhiều lời ngợi ca, hình cảnh hàng ngàn hòn đảo đá vôi kỳ vĩ rải rác trên bề mặt nước biển trong xanh phẳng lặng đã đủ khiến bất kỳ ai cũng phải ngỡ ngàng. 

---

## Những Điểm Đến Phải Khám Phá Khi Lênh Đênh Trên Vịnh

Hành trình khám phá Vịnh Hạ Long thường bắt đầu trên những chiếc du thuyền sang trọng. Đây là những toạ độ bạn chắc chắn không muốn lỡ:

- **Hang Sửng Sốt:** Được phát hiện vào năm 1901, đây là một trong những hang động rộng và đẹp nhất vịnh. Đúng như tên gọi, bước vào trong hang, hệ thống thạch nhũ lung linh tạo ra ảo ảnh ánh sáng khiến ai cũng phải "sửng sốt".
- **Hang Luồn & Đảo Ti Tốp:** Chèo thuyền Kayak qua chiếc cổng vòng cung tự nhiên của Hang Luồn để bước vào tâm một hồ nước phẳng lặng được bảo bọc tuyệt đối bởi vách núi. Đừng quên dừng chân ở Đảo Ti Tốp để leo 400 bậc đá lên chóp núi, phóng tầm mắt ôm trọn Hạ Long!
- **Hòn Trống Mái:** Biểu tượng truyền đời của Vịnh Hạ Long, hai hòn đá khổng lồ trông tựa đôi gà vươn cánh giữa biển khơi, tượng trưng cho tình yêu chung thuỷ vượt thời gian.
- **Làng chài Cửa Vạn:** Giao lưu cùng người dân địa phương trên những ngôi nhà nổi, thấu hiểu một cuộc đời neo đậu trên sóng nước.

---

## Hải Sản Tươi Ngon & Văn Hoá Ẩm Thực Đỉnh Cao

Sẽ là thiếu sót nếu đến Hạ Long mà bỏ quên bàn tiệc hải sản:
1. **Chả mực Hạ Long:** Miếng chả mực giã tay 100%, giòn dai sần sật, ăn cùng xôi trắng hay bánh cuốn đều tạo ra hương vị làm thực khách thương nhớ.
2. **Cù kỳ, Bề bề, Sam biển:** Những loại hải sản mang hương vị rạn san hô vô cùng tươi ngon, chế biến như hấp sả gừng, rang muối hay nướng mỡ hành.

Vịnh Hạ Long chính là viên ngọc lục bảo của nước Việt, mang một kỳ quan khiến nhiều tờ báo du lịch quốc tế phải sửng sốt ca tụng.
    `,
  },
  {
    id: "dest-3",
    slug: "da-nang",
    name: "Đà Nẵng",
    province: "Thành phố Đà Nẵng",
    shortDescription: "Thành phố đáng sống nhất Việt Nam với những bãi biển đẹp, núi non hùng vĩ và các công trình biểu tượng.",
    imageUrl: "/destinations/danang.png",
    markdownContent: `
# Đà Nẵng - Thành Phố Đáng Sống Nhất Việt Nam

Nằm ôm lấy dòng sông Hàn thơ mộng và sở hữu đường bờ biển được vinh danh trong top đẹp nhất hành tinh, **Đà Nẵng** là chốn giao thoa hoàn hảo giữa thiên nhiên hoang sơ và đô thị trẻ trung, năng động.

---

## Những Biểu Tượng Của "Thành Phố Những Cây Cầu"

Đà Nẵng khiến du khách mê mẩn bởi quy hoạch tuyệt vời của nó, cho đến hệ thống du lịch đa dạng:

- **Bán đảo Sơn Trà & Chùa Linh Ứng:** Nơi cao nhất của Đà Nẵng để đón nhận luồng gió biển, thăm bức tượng Phật Bà Quan Âm cao 67m hướng mắt ra biển đông phổ độ chúng sinh.
- **Bà Nà Hills & Cầu Vàng:** Lạc vào thế giới thần tiên trên đỉnh núi, nơi có khí hậu 4 mùa luân chuyển, và đặc biệt là check-in "Cầu Vàng" - kiệt tác với đôi bàn tay đá rêu phong nâng dải lụa vàng lơ lửng giữa mây trời vĩ đại.
- **Biển Mỹ Khê & Biển Non Nước:** Lặn ngụp trong làn nước mát rượi, dạo chân trần trên cát biển mịn như bột.
- **Ngũ Hành Sơn:** Quần thể gồm 5 ngọn núi đá vôi với vô số hang động và những huyền thoại cổ xưa.
- **Cầu Rồng vòi phun lửa:** Trải nghiệm xem Rồng thép phun lửa phì nước rực rỡ về đêm ngay trên mặt sông Hàn.

---

## Thiên Đường Ẩm Thực Miền Trung

Đà Nẵng là điểm hội tụ tinh hoa ẩm thực Miền Trung, mang hương vị đậm đà và ngon xoắn lưỡi:

1. **Mì Quảng:** Bát mì trứ danh với cọng phở vàng ươm nghệ, nước dùng hầm thịt chan xăm xắp thêm bánh tráng nướng và lạc rang.
2. **Bánh tráng cuốn thịt heo:** Món ăn "danh bất hư truyền" tốn kém bao nhiêu nước mắm nêm đậm vị.
3. **Bún chả cá, Hải sản tươi:** Nếu bạn thích hải sản sống, chỉ cần tạt vào một quán cóc ngay cạnh bãi biển.

Phồn vinh nhưng bình dị, sang trọng nhưng lại rất mộc mạc - đó là hình ảnh của Đà Nẵng - Thành phố của những nụ cười.
    `,
  },
  {
    id: "dest-4",
    slug: "phu-quoc",
    name: "Phú Quốc",
    province: "Tỉnh Kiên Giang",
    shortDescription: "Đảo ngọc thiên đường với những bãi cát trắng trải dài, nước biển trong vắt và hải sản phong phú.",
    imageUrl: "/destinations/phuquoc.png",
    markdownContent: `
# Phú Quốc - Đảo Ngọc Tiên Cảnh Của Phương Nam

Nằm êm đềm giữa Vịnh Thái Lan, **Phú Quốc** là hòn đảo lớn nhất Việt Nam. Được thiên nhiên ưu ái ban cho những đường bờ biển hoang sơ đẹp mê mẩn, và những rạn san hô vô giá, đó là lý do mà khách Tây hay ta đều say mê "Đảo Ngọc".

---

## Khám Phá Rừng & Biển Hoang Sơ

Tới Phú Quốc, bạn vừa có thể hoà mình vào tiện ích resort 5 sao cao cấp nhất lại vừa có thể "đi trốn" khỏi nền văn minh ở các hòn đảo vệ tinh quanh đây.

- **Bãi Sao & Bãi Kem:** Hai trong số những bãi biển hoang sơ, bờ cát trắng uốn lượn hình vành trăng khuyết và nước sạch và nông an toàn cho trẻ nhỏ.
- **Quần đảo An Thới & Lặn ngắm San Hô:** Đi cano vòng qua Hòn Móng Tay, Hòn Mây Rút, Hòn Thơm; lặn sâu xuống đại dương để chiêm ngưỡng thảm thực vật kỳ vĩ.
- **Hoàng hôn tại Dinh Cậu / Sunset Sanato:** Không một nơi nào tại Việt Nam có hoàng hôn lộng lẫy tía - cam rực rỡ như Phú Quốc. Đừng quên gọi một ly cocktail ướp đá và phiêu diêu theo tiếng nhạc lofi.
- **Grand World & Safari:** Hoà quyện văn hoá trong một thành phố không ngủ Venice thu nhỏ, hay chiêm ngưỡng các loài động vật hoang dã.

---

## Hương Vị Nắng Gió Đại Dương

Món hải sản của Phú Quốc mang vị đậm đà rất "Nam bộ", ăn tươi sống ngay trên bờ biển:

- **Nhum nướng mỡ hành:** Trứng nhum béo ngậy quện với hành phi lạc vỡ.
- **Gỏi cá trích:** Mùa hè ăn gỏi cá cuốn bánh tráng mát rượi, không hề có mùi tanh.
- **Nước mắm & Tiêu sọ:** Đừng quên mua các đặc sản gia vị cực phẩm này làm quà cho người thân ở nhà.

Có thể nói, Phú Quốc là đáp án hoàn hảo cho một chuyến đi nghỉ dưỡng giải toả hoàn toàn muộn phiền nơi phố thị.
    `,
  }
];
