export interface MockWish {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
  approved: boolean;
}

export const initialWishes: MockWish[] = [
  {
    _id: "w1",
    name: "Hội Bạn Thân",
    message: "Chúc mừng hạnh phúc Minh Đông & Diệu Linh! Trăm năm hạnh phúc, mãi mãi bên nhau nhé!",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    approved: true,
  },
  {
    _id: "w2",
    name: "Đồng nghiệp",
    message: "Chúc hai bạn có một ngày cưới thật tuyệt vời và cuộc sống hôn nhân viên mãn ngọt ngào!",
    createdAt: new Date().toISOString(),
    approved: true,
  },
];

declare global {
  // eslint-disable-next-line no-var
  var memoryWishes: MockWish[] | undefined;
}

export function getMemoryWishes(): MockWish[] {
  if (!global.memoryWishes) {
    global.memoryWishes = [...initialWishes];
  }
  return global.memoryWishes;
}
