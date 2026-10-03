// 内置曲库。乐谱使用通用的标准 Virtual Piano 记谱法（61 键，大写 = 黑键），
// 程序加载时会自动换算成 40 键布局显示：
//   字母/数字 = 一个音，[abc] = 和弦，[a b c] = 快速琶音，- = 停顿，| = 长停顿
// bpm：每个音符 / 停顿记为一个八分音符时值。
window.BUILTIN_SONGS = [
  {
    // 乐谱来自 virtualpianosheet.com/sheets/gravity-falls-main-title-theme
    id: "gravity-falls-main-title-theme",
    title: "Gravity Falls Main Title Theme",
    artist: "Brad Breeck",
    bpm: 128,
    versions: [
      {
        difficulty: "Easy",
        sheet: `g d p d g d p d
g s p s g s p s
f S p S f S p S
f S p S f S j-
[9d]---f-
g----
[qj] - h h-j-
s----
[^d]---f-
g--f--
[8h]--j--
[6h]--g--
9-g-g-g-
j-j-h-g-
q-j-j-j-
h-j-h-g-
^-g-g-g-
j-j-h-g-
8-j-j-j-
6-L-L-L-
9-g-g-g-
[qj]-j-h-g-
^-J-J-J-
[8h]--l--
[6j]--L--
[9gz] d p d f S p S
d--[dz]`,
      },
      {
        difficulty: "Intermediate",
        sheet: `[29g] d p d g d p d
[4gq] s p s g s p s
[6ef] S p S f S p S
[6ef] S p S [6ef]-j-
[2dy] 6 9 6 q 9 [6fu] 9
[2gip] 6 q 6 q 9 6 9
[4jps] 8 q [8ho] e q [8jp] q
[4st] 8 q 8 e q 8 q
[^dy] q E q y E [fqu] E
[^gi] q E q [fy] E q E
[8hos] w t w [jpu] t w 8
[8ho] 0 e 0 [giT] e 0 6
2 6 [9gi] 6 [2gi] 6 [9gi] 6
[2jp] 6 [9jp] 6 [2ho] 6 [3gi] 6
4 8 [jpq] 8 [4jp] 8 [jpq] 8
[4ho] 8 [jpq] 8 [4ho] 8 [giq] 8
^ q [Egi] q [^gi] q [Egi] q
[^jp] q [Ejp] q [^ho] q [Egi] q
8 w [jpt] w [8jp] w [^jp] w
6 0 [eLS] 0 [6LS] 0 [eLS] 0
2 6 [9gi] 6 [2gi] 6 [3gi] 6
[4jp] 8 [jpq] 8 [4ho] 8 [giq] 8
^ q [EJP] q [^JP] q [EJP] q
[8ho] w t w [8ls] w t w
[6jpS] 0 e 0 [6fLS] 0 e-
[9egpy] d g j f S j L
[z]--[2]--`,
      },
    ],
  },
  {
    // 按用户提供的五线谱（♩=140）转写：右手高八度（8va），左手原位；一行 = 一小节，反复记号已展开
    id: "resident-evil-main-title",
    title: "生化危机 Resident Evil Main Title Theme",
    artist: "Marco Beltrami & Marilyn Manson",
    bpm: 140,
    versions: [
      {
        difficulty: "Easy",
        sheet: `b - - b - - b -
v - - - x - - -
c - - c - - c -
z - - - x - - -

b - - b - - b -
v - - - x - - -
c - - c - - c -
z - - - x - - -`,
      },
      {
        difficulty: "Intermediate",
        sheet: `b - - b - - b -
v - - - x - - -
c - - c - - c -
z - - - x - - -

b - - b - - b -
v - - - x - - -
c - - c - - c -
z - - - x - - -

b j f [jb] - J b j
v f j h x f j f
c g J [gc] d g c -
z d j d x g j f

b j f [jb] - J b j
v f j h x f j f
c g J [gc] d g c -
z d j d x g j f

b j f [jb] - J b j
v f j h x f j f
c g J [gc] d g c -
z d j d x g j f

[jb] f j b J - [jb] -
[fv] j h - [fx] j f -
[gc] J g [dc] g - c -
z d j d x g j f

b - j [fb] j - [Jb] -
[jv] - f j [hx] - f j
[fc] - g [Jc] g d [gc] -
z d j d x g j f

b j f [jb] - J b j
v f j h x f j f
c g J [gc] d g c -
z d j d x - - -`,
      },
    ],
  },
  {
    // 乐谱来自 virtualpianosheet.com/sheets/pirates-of-the-caribbean
    id: "hes-a-pirate",
    title: "加勒比海盗 He's a Pirate",
    artist: "Klaus Badelt & Hans Zimmer",
    bpm: 128,
    versions: [
      {
        difficulty: "Easy",
        sheet: `e t y-y-
y u i-i-
i o u-u-
y t t y -
e t y-y-
y u i-i-
i o u-u-
y t y--
e t y-y-
y i o-o-
o p P-P-
p o p y -
y u i-i-
o-p y -
y i u-u-
i y u--
e t y-y-
y u i-i-
i o u-u-
y t t y -
e t y-y-
y u i-i-
i o u-u-
y t y--
e t y-y-
y i o-o-
o p P-P-
p o p y -
y u i-i-
o-p y -
y i u-u-
y t y`,
      },
      {
        difficulty: "Advanced",
        sheet: `y y y y y y y y y y
y y y y y y y y [2y]
y y y [2y] y [2y] e
t [29qey] [29qey]
[29] [qey] [18etu]
[^Eyi] [^Eyi] ^
[Eyi] [^yo] [6etu]
[6etu] 6 [ey] [6t]
[29et] [ey] [29]
[29] e [29t] [^Eqy]
[^Eqy] ^ [Ey] [^Eu]
[4eti] [4eti] 4 [ti]
[4to] [18tu] [18tu]
6 [ey] [6t] [29qey]
[29] [29] e [29t]
[29qey] [29qey] [29]
[ey] [29ei] [^Eyo]
[^Eyo] ^ [yo] [^yp]
[5yoP] [5yoP] 5 [ip]
[5uo] [29ip] y [29]
[29] y [29u] [^Eyi]
[^Eyi] ^ [Eyo] ^
[29yip] y [29] [29]
y [29i] [T6eu]
[T6eu] 6 [Ei] [E6y]
[T6eu] 6 6 p [6s]
[29ipd] [29ipd] [29]
[ipd] [29psf] [^Pdg]
[^Pdg] ^ [Pdg] [^dh]
[6psf] [6psf] 6 [pd]
[6os] [29ps] [pd]
[29] [29] p [29s]
[^Pid] [^Pid] ^ [Pd]
[^Pf] [4psg] [4psg]
4 [sg] [4sh] [18osf]
[18osf] 6 [pd] [6s]
[29ipd] [29] [29] p
[29s] [29ipd]
[29ipd] [29] [pd]
[29pg] [^Pdh] [^Pdh]
^ [dh] [^dj] [5dhJ]
[5dhJ] 5 [gj] [5fh]
[29gj] d [29] [29] d
[29f] [^Pdg] [^Pdg]
^ [Pdh] ^ [29gj] d
[29] [29] d [29g]
[S6pf] [S6pf] 6 d
[6s] [29pd] [29pd]
[18psf] [18sdg]
[18g] g [^Pdh]
[6dgj] 6 6 [pg]
[6pd] [6p] 6 6 6
[5dhJ] 5 5 [Ph]
[P5d] [5P] 5 5 5
[6eu] u 6 [6qey] 6
[T6ei] 6 6 i [6o]
[29yip] [29yip] [29]
[yip] [29] [29yiP]
[yip] [29] [29] [29]
[29] [18tuo] [18tuo]
[18] [tuo] [18]
[4qtuo] [tip] [4q]
[4q] [4q] [4q]
[29yip] [29yip] [29]
[yip] [29] [29yiP]
[yip] [29] [29] [29]
[29] [T6uo] [T6i] 6
[eu] 6 [29qey] [29]
[29] y [29u] [29eyi]
[29] [29] o [29p]
[18wto] [18wti] [18]
[18wtu] [18] [4qeti]
[4qeto] [4q] [4qetp]
[4q] [18tuo] [18]
[18] [18i] [18o]
[4qtip] [4q] [4q]
[4qo] [4qi] [T6u]
[T6i] 6 [T6u] 6
[29qey] [29] [29] u
[29t] [29qey] [29]
[29] d [29f] [29pdg]
[29] [29] f [29g]
[18sh] [18sg] [18]
[sh] [18] [4qgj]
[4qsh] [4q] [4qsg]
[4q] [^Pid] ^ ^ [^d]
[^f] [29pdg] [29pdh]
[29] [29dj] [29]
[5dPJ] [P5d] 5 [P5h]
5 [6pg] 6 6 [6h]
[6f] [6pd] 6 6 [6f]
[6S] [29dgj] [29]
[29] [29] [29]
[5dhJ] 5 5 5 5
[4qsgj] [4qsgj] [4q]
[sgj] [4q] [18sfj]
[sfh] [18] [18] [18]
[18] [P5dh] 5 5 5 5
[6pdg] 6 6 6 6
[S6pf] [6pdg] 6
[S6pf] 6 [29pf] d
[29] [29yd] [29uf]
[29ig] [29pdgj] [29]
[29yd] [29uf] [29ig]
[dg^PJ] ^ [^yd]
[^uf] [^ig] [4qpsgj]
[4qpsgj] [4q]
[4qsgjl] [4q]
[18psfj] [oh] [18]
[18] [18] [18]
[P5odh] 5 5 5 5
[6ipdg] 6 6 6 6
[S6upf] [6ipdg] 6
[S6upf] 6 [29yipd]
[29] [29] [29] [2y]`,
      },
    ],
  },
  {
    // 第一乐章开头。音符参考 virtualpianosheet.com/sheets/symphony-no-5，
    // 补上了弱起休止和延长记号的时值；原速二分音符 = 108，即八分音符 216
    id: "symphony-no-5",
    title: "命运交响曲 Symphony No. 5",
    artist: "Ludwig van Beethoven",
    bpm: 216,
    versions: [
      {
        difficulty: "Easy",
        sheet: `- o o o Y - - - - - - -
- i i i y - - - - - - - - - - -
- o o o Y O O O o D D D s - - -
- o o o y O O O o g g g d - - -
o o i Y ( ( q w o o i Y ( ( q w
o o i Y - - -
[YI] - - -
[yo] - - - - - - -`,
      },
      {
        difficulty: "Intermediate",
        sheet: `- [wo] [wo] [wo] [(Y] - - - - - - -
- [qi] [qi] [qi] [9y] - - - - - - - - - - -
- o o o [(Y] O O O [wo] D D D [8s] - - -
- o o o [9y] O O O [wo] g g g [9d] - - -
[8o] o i Y ( ( q w [8o] o i Y ( ( q w
[wo] [wo] [qi] [(Y] - - -
[8YI] - - -
[7yo] - - - - - - -`,
      },
    ],
  },
  {
    // 人声主旋律（不含前奏、间奏和伴奏）。1=B，♩=130，一个音符 / 停顿 = 八分音符，每行两小节。
    // 简谱来自 jianpu.space，并与 flat.io 上的钢琴编配核对过副歌
    id: "gu-yong-zhe",
    title: "孤勇者",
    artist: "陈奕迅",
    bpm: 130,
    versions: [
      {
        difficulty: "主旋律",
        sheet: `Y - - - - - - -   - - - - - r T r
Y - - - - - - -

- - - r T r T Y   W - - r W - - r
W - - r T - r -   E - - - - - - -
- - - - - - - -

Y - - - - - - -   - - - - - r T r
Y - - - - - - -

- - - r T r T Y   W - - r W - - r
W - - r Y - r T   E - - - - - - -
- - - - - - - -

W r O - - O O I   O - O I O I O I
- Y - - - - - -   - - - - - - W r

O - - O O I O I   P - - P P O P -
- I O Y - - - -

- - - - - Y I Y   T - - Y T - - Y

T - - Y I Y I Y   T - - Y T - - Y
T - - - - - r T

Y - W - r - Y -   T - - Y T r r -
W - - - - - - -

- - - - - - O P   a S P a a - a P
a S P a a - a S

D S D S D - D S   D - G - D - O P

a S P a a - a P   a S P a a - a S

D S D S D - D S   D - G - D - G -

D - - G D - - G   D G H D G - G -

D - - G D - - G   D G H D G - G G

D - S - S - a D   - - S - S - a a
O - - - - - - -

- - - - - - G G   D - S - S - a D
- - S - S - a a   O - - - - - - -

- - - - - - O I   O - - I O I O I
O - O I O I O I   - Y - - - - - -

- - - - - - O I   O - - I O I O I
P - - O P O P O   - Y - - - - - -

- - - - - Y I Y   T - - Y T - - Y

T - - Y I Y I Y   T - - Y T - - Y

T - - - - - r T   Y - O - a - D -
S - - D S - a -   O - - - - - - -

- - - - - - O P   a S P a a - a P
a S P a a - a S

D S D S D - D S   D - G - D - O P

a S P a a - a P   a S P a a - a S

D S D S D - D S   D - G - D - G -

D - - G D - - G   D G H D G - G -

D - - G D - - G   D G H D G - G G

D - S - S - a D   - - S - S - a a
O - - - - - - -

- - - - - - G G   D - S - S - a D
- - S - S - a a   O - O - a - D -

J - - - J - J J   - H - - - - - -
- - - - - - - -

- - O - a - D -   J - - - J - J J
- H - - - - - -   - - - - - - O P

a S P a a - a P   a S P a a - a S

D S D S D - D S   D - G - D - O P

a S P a a - a P   a S P a a - a S

D S D S D - D S   D - G - D - G -

D - - G D - - G   D G H D G - G -

D - - G D - - G   D G H D G - G G

D - S - S - a D   - - S - S - a a
O - - - - - - -

- - - - - - G G   D - S - S - a D
- - S - S - a a   O - - - - - - -`,
      },
    ],
  },
  {
    // 人声主旋律，按 flat.io 上的一份小提琴旋律谱（♩=120）转写，反复记号已展开，一行 = 一小节。
    // 一个音符 / 停顿 = 三连音八分音符（1/3 拍），所以 bpm 记为 180；普通八分音符落在三连音格上
    id: "golden",
    title: "Golden",
    artist: "HUNTR/X（KPop Demon Hunters）",
    bpm: 180,
    versions: [
      {
        difficulty: "主旋律",
        sheet: `- - - o p a a - - o p a
a - - - - d - - - - o o
p - - - - d - - - - I I
I - u - - - - - - - - -
- - - o p a a - - o p a
a - - - - d - - - - o o
p - - - - I - - - - u I
I - u - I - I - - y - p

- - p - - p - - u y - p
- - p - - p - - y - - -
p - p - p - p - p - p -
a - - - - - - - u y - p
- - p - - p - - u y - p
- - p - - a - - y - - -
p - p - p - p - o - I -
I - u - - - - - - - - -

u - - o - - s - - a - -
y - - o - - f - - d - -
I - - p - - d - - s - s
- - a - - - - - - - - -
u - - o - - s - - a - -
y - - o - - f - - d - -
I - - p - - d - - - - -
- - - - - - - - - - - -

- - - - - - - - a a - f
f - - f - - f - a a - d
d - - p - - s d d d s s
s - a - - - s d d d s s
s - a - - - p - a - o -
f - - f - - h - G f - d
d - - p - - s d d d s s
s - a - - - s d d d s s
s - a - - - p - a - o -

u - - o - - s - - a - -
y - - o - - f - - d - -
o - - a - - j - - G - h
- - f - - - - - - I - -
u - - o - - s - - a - -
y - - o - - f - - d - -
o - - a - - j - - G - h

- - - - - - - - - o - o
j - h - - - G - G - G -
- - - d - - - - - a - a
f - - - d - a - a - a -
- - - - - - - - - o - o
j - h - - - G - G - G -
- - - d - - - - a a - f
f - - - d a d - a - p -
a - p - - - - - - - - -

u - - o - - s - - a - -
y - - o - - f - - d - -
o - - a - - j - - G - h
- - f - - - - - - I - -
u - - o - - s - - a - -
y - - o - - f - - d - -
o - - a - - j - - G - h
- - - - - - - - - - - -

- - - - - - h - G - f -
h - f - - - - - - I - -
u - - o - - s - - a - -
y - - o - - f - - d - -
o - - a - - j - - G - h
- - - - - - d - d - o -

p p p p p p p - a - - p
o p p p p p - - - - - -
o p p p p p p - a - - p
o p p p p p - - p p - o

u - - o - - s - - a - -
y - - o - - f - - d - -
o - - a - - j - - G - h
- - - - - - - - - - - -`,
      },
    ],
  },
  {
    // 乐谱来自 virtualpianosheet.com/sheets/mia-and-sebastians-theme
    id: "mia-and-sebastians-theme",
    title: "爱乐之城 Mia & Sebastian's Theme",
    artist: "Justin Hurwitz",
    bpm: 128,
    versions: [
      {
        difficulty: "Easy",
        sheet: `[u8] p a s a p [i9]| |
[wi] p a s a p [u8]| |
[u8] p a s a p [i9]| |
[wd] s a s a p [u8]| |
[f8] j k l k j [g9]| |
[wg] j k l k j [f8]| |
[f8] j k l k j [g9]| |
[zw] l k l k j [f8]| o p a s
[g9] f d f d s [wp]| t| [ya]|
[f8] d s d s a [qp]| t| y|
[g9] f d f d s [wp]| t| [ya]|
[f8]| o| p| [p8]| s| f|
[wj] h g h g f [wd]| e r t y
[k0] j H g f d [s6]| p| O|
[p4] a p a s|
[p3] a p a s|
[p@] a p a s p [d2]| [OI]| [sH]|
[wS] d [rS] d f|
[SQ] d [SE] d f|
[qd] D [ed] D f g [hd0]|||v| 6|
BcxcvcL JlLlJlL hgfgJgS PsSsasS [tiQ9]|||
[riZ]| L| k| J| V| v| c| Z| L| L| [wusP8]|||[qgO]`,
      },
      {
        difficulty: "Intermediate",
        sheet: `T I O p O I y y I O
p O I T [T6] I O 0 p
O I y 7 a [Qe] r
[ak0] [pj] [OH] r
[pj] [OH] r [IG]
[TS] 6 [u0] I Q O W
p e [d7e] S a [ry] S
a [ry] p I 0 [ey] O
r [S6] a p [0T] a p
[0T] O I 9 [eT] r
[d7] S a [Qy] S a
[Qy] p I 0 [ey] O r
[S6] u 0 i q [TI]
[6Q] p e [TS] [dG7]
[Sf] [ad] [Qy] [Sf]
[ad] [Qy] [pS] [Oa]
0 0 Q W e r [gH*]
[dG] [Sg] [Wr] [ad]
[pS] [Wr] [Oa]
[OpQT] I i [I9] O I
e O p e I * O I e O
p e I 8 O I [Qe] O p
8 I * i O S W r T i
O a S g H k L c V n
L [TS6] G I [OH]
[0e] [pj] [OH] [0e]
[IG] [yd] 7 [akQe]
[0r] [ak3] [pj] [OH]
[ru] [pj] [OH] [ru]
[IG] [TS] 6 [uf]
[0e] [IG] [OH] [0e]
[pj] [dz] [7e] [SL]
[ak] [ry] [SL] [ak]
[ry] [pj] [IG] 0
[ey] [OH] r [SL6]
[ak] [pj] [0T] [ak]
[pj] [0T] [OH] [IG]
9 [eT] r [dz7] [SL]
[ak] [Qy] [SL] [ak]
[Qy] [pj] [IG] 0
[ey] [OHr] [SL6]
[uf0] [igq] [IG6Q]
[pje] [SL] [GC7]
[fx] [dz] [Qry] [fx]
[dz] [Qry] [SL] [ak]
0 0 Q W e r [HV*r]
[GC] [gc] [WrT] [dz]
[SL] [WrT] [ak] [pj]
$ [IG*Q] [ig] [I2] O
I [9e] O p e [I!] O
I [*e] O p e [I1] O
I [Qe] O p 8 I * W r
i O S g $ * Q I p S
G`,
      },
    ],
  },
  {
    id: "fur-elise",
    title: "致爱丽丝 Für Elise",
    artist: "Ludwig van Beethoven",
    bpm: 150,
    versions: [
      {
        difficulty: "Easy",
        sheet: `f D
f D f a d s
p - - t u p
a - - u O a
s - - u f D
f D f a d s
p - - t u p
a - - u s a
p - - - - -`,
      },
      {
        difficulty: "Intermediate",
        sheet: `f D
f D f a d s
[6p] 0 e t u p
[3a] 0 W u O a
[6s] 0 e u f D
f D f a d s
[6p] 0 e t u p
[3a] 0 W u s a
[6p] 0 e - - -`,
      },
    ],
  },
  {
    id: "ode-to-joy",
    title: "欢乐颂 Ode to Joy",
    artist: "Ludwig van Beethoven",
    bpm: 55,
    versions: [
      {
        difficulty: "Easy",
        sheet: `u u i o o i u y
t t y u u y y -
u u i o o i u y
t t y u y t t -
y y u t y [u i] u t
y [u i] u y t y w -
u u i o o i u y
t t y u y t t -`,
      },
      {
        difficulty: "Intermediate",
        sheet: `[8u] u i o [5o] i u y
[8t] t y u [5u] y [5y] -
[8u] u i o [5o] i u y
[8t] t y u [5y] t [8t] -
[5y] y u t [5y] [u i] u t
[5y] [u i] u y [8t] y [5w] -
[8u] u i o [5o] i u y
[8t] t y u [5y] t [8t] -`,
      },
    ],
  },
  {
    id: "twinkle",
    title: "小星星 Twinkle Twinkle Little Star",
    artist: "Traditional",
    bpm: 55,
    versions: [
      {
        difficulty: "Easy",
        sheet: `t t o o p p o -
i i u u y y t -
o o i i u u y -
o o i i u u y -
t t o o p p o -
i i u u y y t -`,
      },
      {
        difficulty: "Intermediate",
        sheet: `[8t] t [0o] o [qp] p [0o] -
[qi] i [8u] u [5y] y [8t] -
[0o] o [qi] i [8u] u [5y] -
[0o] o [qi] i [8u] u [5y] -
[8t] t [0o] o [qp] p [0o] -
[qi] i [8u] u [5y] y [8t] -`,
      },
    ],
  },
  {
    id: "frere-jacques",
    title: "两只老虎 Frère Jacques",
    artist: "Traditional",
    bpm: 60,
    versions: [
      {
        difficulty: "Easy",
        sheet: `t y u t t y u t
u i o - u i o -
[o p] [o i] u t [o p] [o i] u t
t w t - t w t -`,
      },
    ],
  },
  {
    id: "happy-birthday",
    title: "生日快乐 Happy Birthday",
    artist: "Traditional",
    bpm: 100,
    versions: [
      {
        difficulty: "Easy",
        sheet: `o o
p - o - s -
a - - - o o
p - o - d -
s - - - o o
h - f - s -
a - p - g g
f - s - d -
s - - -`,
      },
      {
        difficulty: "Intermediate",
        sheet: `o o
[8p] - o - s -
[5a] - - - o o
[5p] - o - d -
[8s] - - - o o
[8h] - f - s -
[qa] - p - g g
[8f] - s - [5d] -
[8s] - - -`,
      },
    ],
  },
];
