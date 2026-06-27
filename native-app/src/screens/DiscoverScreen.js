import React, { useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../AppContext";
import { CAMPUSES, clubIcon, INTERESTS, CAT_ICON, tagForLabel } from "../data";

export default function DiscoverScreen() {
  const {
    clubList, cardIdx, st, A, T, setShowAddClub, isPremium, homeCampus,
    pickCampus, campus, setClubDetail, joined, interest, swipe, setInterest, setCardIdx,
  } = useContext(AppContext);

    const list = clubList();
    const club = list.length ? list[cardIdx % list.length] : null;
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={[st.title, { color: A }]}>Discover</Text>
            <Text style={[st.sub, { color: T.subtext }]}>Find your people & passions</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddClub(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: A, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, marginTop: 4 }}>
            <Ionicons name="add" size={16} color="white" />
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 12 }}>List club</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          {Object.entries(CAMPUSES).map(([key, c]) => {
            const locked = !c.free && !isPremium && key !== homeCampus;
            return (
              <TouchableOpacity key={key} onPress={() => pickCampus(key)} style={[st.pill, { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: campus === key ? A : T.card, marginRight: 8 }]}>
                <Ionicons name={locked ? 'lock-closed' : 'school'} size={11} color={campus === key ? 'white' : T.subtext} />
                <Text style={{ color: campus === key ? 'white' : T.subtext, fontWeight: '700', fontSize: 12 }}>{c.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {club ? (
          <TouchableOpacity activeOpacity={0.9} onPress={() => setClubDetail(club)} style={[st.clubCard, { backgroundColor: club.colors[0], padding: 0, overflow: 'hidden', justifyContent: 'flex-start' }]}>
            {/* "picture" — big icon on a tinted band */}
            <View style={{ height: 130, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={clubIcon(club)} size={58} color="white" />
            </View>
            <View style={{ padding: 18 }}>
              <View style={st.clubTag}><Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>{club.tag}</Text></View>
              <Text style={st.clubName}>{club.name}</Text>
              <Text style={st.clubDesc} numberOfLines={2}>{club.desc}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <View style={st.metaPill}><Text style={st.metaPillText}><Ionicons name="people" size={11} color="white" /> {club.members.toLocaleString()}</Text></View>
                <View style={st.metaPill}><Text style={st.metaPillText}><Ionicons name="location" size={11} color="white" /> {club.location}</Text></View>
                {joined.includes(club.name) && <View style={[st.metaPill, { backgroundColor: 'rgba(255,255,255,0.45)' }]}><Text style={st.metaPillText}>✓ Joined</Text></View>}
              </View>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '800', marginTop: 10 }}>ⓘ Tap to view full details →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[st.clubCard, { backgroundColor: T.card, alignItems: 'center', justifyContent: 'center' }]}>
            <Ionicons name="search" size={40} color={T.subtext} />
            <Text style={{ fontSize: 16, fontWeight: '800', color: T.text, marginTop: 6 }}>No {interest} clubs yet</Text>
            <Text style={{ fontSize: 12, color: T.subtext, marginTop: 4 }}>Try another interest!</Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginVertical: 14 }}>
          <TouchableOpacity onPress={() => swipe('skip')} style={[st.actionBtn, { backgroundColor: T.card }]}><Ionicons name="close" size={22} color={T.subtext} /></TouchableOpacity>
          <TouchableOpacity onPress={() => swipe('join')} style={[st.actionBtn, { backgroundColor: A }]}><Ionicons name="checkmark" size={22} color="white" /></TouchableOpacity>
        </View>
        <Text style={[st.sectionLabel, { color: T.subtext }]}>FILTER BY INTEREST</Text>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true} style={{ maxHeight: 240 }} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
          {INTERESTS.map(i => {
            const on = interest === i;
            const icon = i === 'All' ? 'apps' : CAT_ICON[tagForLabel(i)];
            return (
              <TouchableOpacity key={i} onPress={() => { setInterest(i); setCardIdx(0); }}
                style={[st.pill, { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch', backgroundColor: on ? A : T.card, borderWidth: 1, borderColor: on ? A : T.border }]}>
                <Ionicons name={icon} size={14} color={on ? 'white' : T.subtext} />
                <Text style={{ color: on ? 'white' : T.subtext, fontWeight: '700', fontSize: 13 }}>{i}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>
    );
}
