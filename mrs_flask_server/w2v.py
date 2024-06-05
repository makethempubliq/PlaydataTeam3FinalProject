{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 8,
   "id": "2492cf4a-937e-4c25-9189-dd9c92970ecb",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "태그를 입력하세요 (공백으로 구분): \n"
     ]
    },
    {
     "name": "stdin",
     "output_type": "stream",
     "text": [
      " 공부 집중\n"
     ]
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "플레이리스트의 길이를 입력하세요 (예: 30분이면 0시간 30분, 1시간이면 1시간 00분). 형식: ?시간 ??분\n"
     ]
    },
    {
     "name": "stdin",
     "output_type": "stream",
     "text": [
      " 2시간 00분\n"
     ]
    },
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Top 40 Spotify IDs for a playlist of 2 hours and 0 minutes tagged '공부 & 집중':\n",
      "Melon ID             Spotify ID           Song Title\n",
      "  226156 0Ah3p1ilJyjOvqbhl1JHO2             Suddenly\n",
      "   26590 7D7pmQkLPSQOmowocjn7ra         바람따라 가는 기차여행\n",
      "  304758 3Qu86PhgExugkNrveBW4gH          오늘 하루는 어땠나요\n",
      "  121837 1POYtMdUBbCBXQcjwTruXM              하루를 마치며\n",
      "  145723 1iANXWhuZ0rbhsYLNp88xl               이제는 안녕\n",
      "   87434 1PJ7cZg6gi5DfMBcQLrqy3               반갑다 봄아\n",
      "   46911 5oMr9rp5PeX8WfcatudDaY        Happy And Sad\n",
      "   52192 0wKu8V1KDBBKLvUV2seTwl        Fresh Morning\n",
      "   45903 2eKbOX31EvI54G8CoSufRZ         Morning Calm\n",
      "  205783 4RgeBDfKRICEUwsxzNHBf3              눈이 올때마다\n",
      "  476324 5RFXBg3GOEUwMO9BNifWOC           Refreshing\n",
      "  309981 5fOFmij6Mxgqdku9Cuf9Y8          Slow N Slow\n",
      "  660352 3r6nDQQinVGt6u3vgHZIO5            지나던 그 골목길\n",
      "  246131 0SZwTcyp6qcICqdRVOpbPy              One Day\n",
      "  199923 3X9l1FLY26WMI3iK5HBNpJ              그대가 그립다\n",
      "  234554 6LN5nVcTb3k9V094EP1BTI          Spring Time\n",
      "  432128 60LESd86Lw7R8zsZHiQO0D                 작은나라\n",
      "  620646 21gx0HZlwzhjt21I288eTD                  봄소리\n",
      "  199389 74aT699vpGQT8gQIVRx6eb        classic waltz\n",
      "  112904 0fmUV9rZ8zDtkjrQ4iaMvS            Rainy Day\n",
      "  458507 0W6q9ktQA7eIVq7TEcJkoz          Forest Bird\n",
      "  456174 045lDL2Ss8MvkJ7TbwnE9g             기억속의 기다림\n",
      "  412695 5pLVbNSrqGpaV14VrpYQr9                눈을 뜨면\n",
      "  438061 0e1Ine67VCyorHPlqhSq03             Grateful\n",
      "  592549 5ma2vB51a2s6O8pH3Jl4Zv             둘이서 걷던 길\n",
      "  130680 7HN1MqB4WeakMSXLejwuma             꽃이 되어 피다\n",
      "   94141 3iSSEartcDrIFKB6VppQ9k          우리가 아름답던 날들\n",
      "  221248 4m05o3uYWbD9qEorFwy3tL               Memory\n",
      "  347564 3v1oz5UeBzTkJ7bei8wgoB         바람이 불어오는 곳으로\n",
      "  522316 3Br99cjCijawwl3gCaSeBl          너의 기억은 눈부시다\n",
      "  629217 0QvhzKLh35KG6lSpgTkQpt        가장 조용했던 밤의 위로\n",
      "  490447 0VVVvhF1PS7Y1nqhKkkpLR           Old Memory\n",
      "  422987 0GDHLfgxwYpGgCQ6HZhgpo      참 좋은날 당신을 만났습니다\n",
      "  508432 5LX27Z2qbLunJAulBUGGaX              지난 날...\n",
      "  595652 2WSfAVIn6DVPecE4UO10m6           바다가 보이는 언덕\n",
      "  347950 2WBBXa8DYl5aNLhwLsyzRk 별의 바다 (Sea Of Stars)\n",
      "   29793 2agBDIr9MYDUducQPC1sFU   River Flows In You\n",
      "  316105 4gqKl7AD6JTGSjHNl6D1Hz            내 마음속 이야기\n",
      "    6945 0jBxhRIYBsMQlXG0pIuIKs           위로가 필요한 밤에\n",
      "  363950 5Skd6cqHM83SODqpnODZI5                 바다여행\n"
     ]
    }
   ],
   "source": [
    "%run script.py --recommend"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 25,
   "id": "986fbb30-e083-46a6-a836-a21607e2e2f6",
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "40"
      ]
     },
     "execution_count": 25,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "len(['2tnt7LKXyTCVfbsfEgJuGX', '4eFTh1opLS5wANDmZK9ghC', '0kUNERs28NE0btoskAwaj9', '3z9s9hp6ouAxH0IUojkC6L', '5gkB40BDQE1CvtXpF6fcPm', '6YOXdy9jShw66iOnBzQMKv', '3P3UA61WRQqwCXaoFOTENd', '3ucfniv4fLB3RPA6N9iLM2', '54r8KibtmiMzKnj5qAKpg9', '0GsRx0gPft6RmijIwMsKmG', '5eO04wLeM487N9qhPHPPoB', '3MgWFkrUFnoxMcxxtTn7WN', '5xuVcWfj8QTeRLRSKyQOyi', '3jsYQw78lrxJA2ysnmOIf9', '4O3VNe57RiONe9DGJkzE80', '6flL0uwB63XwYpu5wdnVrS', '5oqt4pBXTrU02N2mELJXKz', '3Ml2s37uS9jqRM2R3bfDiB', '0HNIIJzAVqPXmUOZFx03Av', '3gug38ZhXQWJbwN7sh0YRR', '1rVPj9cryjgB7MdaU6sqN3', '6dGsBRuavumBs5BghcXF3D', '1kODSVImpAKU1bbZvlNX2s', '2nJDePK69THatYkjkjQFE8', '6nSHtgTH5a959xPucs6Ilb', '7sLXhTvxyWtuTh7196N8gx', '1Vd8qFWC07LB8UvNHyIlzg', '42kag4xe2dITRgGbHiD2cQ', '3hbi6hayJ6OibzGe3fWLwf', '2tnt7LKXyTCVfbsfEgJuGX', '4eFTh1opLS5wANDmZK9ghC', '0kUNERs28NE0btoskAwaj9', '3z9s9hp6ouAxH0IUojkC6L', '5gkB40BDQE1CvtXpF6fcPm', '6YOXdy9jShw66iOnBzQMKv', '3P3UA61WRQqwCXaoFOTENd', '3ucfniv4fLB3RPA6N9iLM2', '54r8KibtmiMzKnj5qAKpg9', '0GsRx0gPft6RmijIwMsKmG', '5eO04wLeM487N9qhPHPPoB'])"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "6e0ec4c1-990a-4f95-9b84-a94c15278092",
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.11.5"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
