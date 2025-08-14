import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { 
  Star, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  Heart,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TalentDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  const mockJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Global',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80K - $120K',
      tags: ['React', 'TypeScript', 'Node.js'],
      trustRequired: 4,
      posted: '2 days ago',
      applicants: 15
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'Creative Studios',
      location: 'Lagos, Nigeria',
      type: 'Contract',
      salary: '$40 - $60/hr',
      tags: ['Figma', 'UI Design', 'Prototyping'],
      trustRequired: 3,
      posted: '1 week ago',
      applicants: 8
    },
    {
      id: 3,
      title: 'Mobile App Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Part-time',
      salary: '$50 - $70/hr',
      tags: ['React Native', 'Flutter', 'Mobile'],
      trustRequired: 3,
      posted: '3 days ago',
      applicants: 12
    }
  ];

  const trustScore = 3;
  const maxTrustScore = 5;

  const renderTrustScore = () => (
    <View style={styles.glass}>
      <View style={styles.trustScoreHeader}>
        <Text style={styles.trustScoreTitle}>Trust Score</Text>
        <View style={styles.trustScoreValueContainer}>
          <Star color="#F7FF00" fill="#F7FF00" size={16} />
          <Text style={styles.trustScoreValueText}>{trustScore}/{maxTrustScore}</Text>
        </View>
      </View>
      
      <View style={styles.trustScoreBarContainer}>
        {Array.from({ length: maxTrustScore }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.trustScoreBar,
              { backgroundColor: i < trustScore ? '#F7FF00' : 'rgba(255, 255, 255, 0.2)' }
            ]}
          />
        ))}
      </View>
      
      <Text style={styles.trustScoreDescription}>
        {trustScore === 0 ? 'Start earning referrals to build trust' : `${trustScore} referrals earned`}
      </Text>
      
      <TouchableOpacity style={styles.referralButton}>
        <Text style={styles.referralButtonText}>Get Referrals</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity style={styles.quickActionCard}>
        <View style={[styles.quickActionIconContainer, { backgroundColor: 'rgba(155, 58, 255, 0.2)' }]}>
          <Users size={24} color="#9B3EFF" />
        </View>
        <Text style={styles.quickActionTitle}>Refer a Friend</Text>
        <Text style={styles.quickActionDescription}>Earn trust together</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.quickActionCard}>
        <View style={[styles.quickActionIconContainer, { backgroundColor: 'rgba(0, 255, 209, 0.2)' }]}>
          <Plus size={24} color="#00FFD1" />
        </View>
        <Text style={styles.quickActionTitle}>Add Portfolio</Text>
        <Text style={styles.quickActionDescription}>Showcase your work</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJobCard = (job) => (
    <View key={job.id} style={[styles.glass, { marginBottom: 16, padding: 20 }]}>
      <View style={styles.jobCardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCompany}>{job.company}</Text>
        </View>
        <View style={styles.jobTrustRequired}>
          {Array.from({ length: job.trustRequired }).map((_, i) => (
            <Star key={i} color="#F7FF00" fill="#F7FF00" size={12} />
          ))}
        </View>
      </View>
      
      <View style={styles.jobDetailsContainer}>
        <View style={styles.jobDetailItem}>
          <MapPin size={12} color="#CCCCCC" />
          <Text style={styles.jobDetailText}>{job.location}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Clock size={12} color="#CCCCCC" />
          <Text style={styles.jobDetailText}>{job.posted}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <DollarSign size={12} color="#CCCCCC" />
          <Text style={styles.jobDetailText}>{job.salary}</Text>
        </View>
      </View>
      
      <View style={styles.jobTagsContainer}>
        {job.tags.map((tag) => (
          <View key={tag} style={styles.jobTag}>
            <Text style={styles.jobTagText}>{tag}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.jobCardFooter}>
        <View style={styles.jobApplicantsContainer}>
          <Eye size={12} color="#CCCCCC" />
          <Text style={styles.jobApplicantsText}>{job.applicants} applicants</Text>
        </View>
        <TouchableOpacity>
          <LinearGradient
            colors={['#9B3EFF', '#00D0FF']}
            style={styles.applyButton}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHomeTab = () => (
    <ScrollView style={styles.tabContentContainer}>
      <View style={styles.homeHeader}>
        <Text style={styles.welcomeTitle}>Welcome back, Talent!</Text>
        <Text style={styles.welcomeSubtitle}>Ready to level up your career?</Text>
      </View>

      {renderTrustScore()}
      {renderQuickActions()}

      <View style={{ marginTop: 24 }}>
        <View style={styles.latestJobsHeader}>
          <Text style={styles.latestJobsTitle}>Latest Opportunities</Text>
          <TouchableOpacity onPress={() => setActiveTab('jobs')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#00FFD1" />
            </View>
          </TouchableOpacity>
        </View>
        
        {mockJobs.slice(0, 2).map(renderJobCard)}
      </View>

      <View style={[styles.glass, { marginTop: 24, padding: 24 }]}>
        <View style={styles.challengeHeader}>
          <LinearGradient
            colors={['#F7FF00', '#9B3EFF']}
            style={styles.challengeIconContainer}
          >
            <Zap size={24} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <Text style={styles.challengeTitle}>Challenge of the Week</Text>
            <Text style={styles.challengeSubtitle}>Build a React Component Library</Text>
          </View>
        </View>
        
        <Text style={styles.challengeDescription}>
          Create a reusable component library with TypeScript and showcase your documentation skills.
        </Text>
        
        <TouchableOpacity style={[styles.participateButton, { backgroundColor: '#F7FF00' }]}>
          <Text style={[styles.participateButtonText, { color: '#2D014D' }]}>Participate Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderJobsTab = () => (
    <ScrollView style={styles.tabContentContainer}>
      <View style={styles.jobsHeader}>
        <Text style={styles.jobsTitle}>Job Board</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#00FFD1" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={16} color="#CCCCCC" style={styles.searchIcon} />
        <TextInput
          placeholder="Search jobs, companies, skills..."
          placeholderTextColor="#CCCCCC"
          style={styles.searchInput}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {['All', 'Remote', 'Full-time', 'Part-time', 'Contract', 'Freelance'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              category === 'All' ? styles.activeCategory : styles.inactiveCategory
            ]}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {mockJobs.map(renderJobCard)}
    </ScrollView>
  );
  
  const renderComingSoon = (title, description, icon, buttonText) => (
    <View style={styles.comingSoonContainer}>
      <View style={[styles.comingSoonIconContainer, { backgroundColor: 'rgba(155, 58, 255, 0.2)' }]}>
        <Award size={40} color="#9B3EFF" />
      </View>
      <Text style={styles.comingSoonTitle}>{title}</Text>
      <Text style={styles.comingSoonDescription}>{description}</Text>
      <TouchableOpacity>
        <LinearGradient
          colors={['#9B3EFF', '#00D0FF']}
          style={styles.comingSoonButton}
        >
          <Text style={styles.applyButtonText}>{buttonText}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'jobs' && renderJobsTab()}
        {activeTab === 'portfolio' && renderComingSoon('Portfolio Coming Soon', 'Showcase your best work and projects', 'award', 'Create Portfolio')}
        {activeTab === 'referrals' && renderComingSoon('Build Your Network', 'Give and receive referrals to build trust', 'users', 'Start Referring')}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabContentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  trustScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trustScoreTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trustScoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustScoreValueText: {
    color: '#F7FF00',
    fontWeight: 'bold',
  },
  trustScoreBarContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  trustScoreBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  trustScoreDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 16,
  },
  referralButton: {
    backgroundColor: 'rgba(0, 255, 209, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  referralButtonText: {
    color: '#00FFD1',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  quickActionDescription: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 4,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  jobCompany: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  jobTrustRequired: {
    flexDirection: 'row',
    gap: 2,
  },
  jobDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  jobTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  jobTag: {
    backgroundColor: 'rgba(0, 255, 209, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  jobTagText: {
    color: '#00FFD1',
    fontSize: 12,
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobApplicantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobApplicantsText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  applyButton: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
  },
  homeHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: '#CCCCCC',
  },
  latestJobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  latestJobsTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  viewAllText: {
    color: '#00FFD1',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  challengeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  challengeSubtitle: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  challengeDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 16,
  },
  participateButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  participateButtonText: {
    fontWeight: '500',
  },
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  jobsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterButton: {
    backgroundColor: 'rgba(0, 255, 209, 0.2)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButtonText: {
    color: '#00FFD1',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    borderRadius: 16,
    paddingLeft: 48,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  activeCategory: {
    backgroundColor: '#9B3EFF',
  },
  inactiveCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonText: {
    color: '#FFFFFF',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  comingSoonIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  comingSoonDescription: {
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
  },
  comingSoonButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default TalentDashboard;
