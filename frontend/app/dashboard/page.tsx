"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Candidate {
  _id: string;
  name: string;
  description: string;
  linkedinUrl: string;
  profileImage?: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  candidates: Candidate[];
}

interface VotedUser {
  _id: string;
  name: string;
  linkedinProfileUrl?: string;
  linkedin?: {
    email?: string;
    picture?: string;
  };
}

interface LeaderboardEntry {
  candidate: Candidate;
  votes: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  linkedin?: {
    id?: string;
    email?: string;
    profileUrl?: string;
    picture?: string;
  };
  google?: {
    id?: string;
    email?: string;
  };
  isLinkedInVerified?: boolean;
}

export default function Dashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [votedUsers, setVotedUsers] = useState<VotedUser[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, votedUsersRes, votesRes, userRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/results/voted-users`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: "include",
        }),
      ]);

      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData);
        setHasVoted(userData.hasVoted || false);
        
        // Redirect to LinkedIn profile page if user hasn't provided their URL
        if (!userData.linkedinProfileUrl) {
          router.push("/linkedin-profile");
          return;
        }
      } else {
        router.push("/");
        return;
      }

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData);
      }

      if (votedUsersRes.ok) {
        const votedUsersData = await votedUsersRes.json();
        console.log('Voted users data:', votedUsersData);
        setVotedUsers(votedUsersData);
      }

      // Calculate vote counts for leaderboard
      if (votesRes.ok) {
        const candidates = await votesRes.json();
        
        // Fetch vote counts from the backend
        const voteCountsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/results/vote-counts`,
          { credentials: "include" }
        );

        if (voteCountsRes.ok) {
          const voteCounts = await voteCountsRes.json();
          
          const leaderboardData = candidates.map((candidate: Candidate) => {
            const voteCount = voteCounts.find(
              (vc: any) => vc.candidateId === candidate._id
            );
            return {
              candidate,
              votes: voteCount ? voteCount.votes : 0,
            };
          });

          leaderboardData.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.votes - a.votes);
          setLeaderboard(leaderboardData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId: string) => {
    if (voting || hasVoted) return;

    setVoting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ candidateId }),
      });

      if (response.ok) {
        setHasVoted(true);
        alert("Vote submitted successfully!");
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.message || "Failed to submit vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to submit vote");
    } finally {
      setVoting(false);
    }
  };

  const handleUserClick = (user: VotedUser) => {
    const profileUrl = user.linkedinProfileUrl;
    if (profileUrl && profileUrl !== '') {
      window.open(profileUrl, "_blank");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      
      // Redirect to login page
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      // Still redirect even if API call fails
      router.push("/");
    }
  };

  const handleLinkLinkedIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/linkedin`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F6F8]">
        <div className="text-xl text-[#0A66C2]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F6F8] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#0A66C2]">
                Voting Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentUser?.email || 'Welcome'}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#0A66C2] text-[#0A66C2] hover:bg-[#EFF3F8] rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <svg className="w-6 h-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
              </div>
              
              {leaderboard.length > 0 && leaderboard[0].votes > 0 ? (
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={entry.candidate._id} className="bg-[#EFF3F8] rounded-lg p-4 border-l-4 border-[#0A66C2]">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-[#0A66C2]">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900">{entry.candidate.name}</h3>
                          <p className="text-sm text-gray-600">{entry.votes} {entry.votes === 1 ? 'vote' : 'votes'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <p>No votes yet!</p>
                  <p className="text-sm mt-2">Be the first to vote</p>
                </div>
              )}
            </div>
          </div>

          {/* Teams and Candidates Section */}
          <div className="lg:col-span-2 space-y-8 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-black">
                Select Your Candidate
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Choose from any team below
              </p>
            </div>

            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                {/* Team Header */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {team.name}
                  </h3>
                  {team.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {team.description}
                    </p>
                  )}
                </div>

                {/* Candidates List */}
                <div className="space-y-4">
                  {team.candidates.map((candidate) => (
                    <div
                      key={candidate._id}
                      className="bg-[#F3F6F8] rounded-lg p-5 flex items-center justify-between gap-5 border border-gray-200"
                    >
                      {/* Candidate Info */}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {candidate.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {candidate.description}
                        </p>
                        <a
                          href={candidate.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0A66C2] hover:underline inline-flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          LinkedIn
                        </a>
                      </div>

                      {/* Vote Button */}
                      <button
                        onClick={() => handleVote(candidate._id)}
                        disabled={voting || hasVoted}
                        className={`px-8 py-3 text-lg rounded-xl font-medium transition-colors whitespace-nowrap ${
                          hasVoted
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#0A66C2] hover:bg-[#004182] text-white"
                        }`}
                      >
                        {voting ? "..." : hasVoted ? "Voted ✓" : "Vote"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Voted Users Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col" style={{ height: '600px' }}>
              <div className="mb-6 flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  Voted Users
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  {votedUsers.length} {votedUsers.length === 1 ? "person" : "people"}
                </p>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 pr-2" style={{ maxHeight: 'calc(600px - 120px)' }}>
                {!hasVoted ? (
                  <div className="text-center py-10 px-4">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Vote to Unlock
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Cast your vote to see who else has voted!
                    </p>
                  </div>
                ) : votedUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-10">
                    No votes yet!
                  </p>
                ) : (
                  votedUsers.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserClick(user)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        user.linkedinProfileUrl
                          ? "bg-[#F3F6F8] hover:bg-[#E8ECEF] cursor-pointer border border-gray-200"
                          : "bg-[#F3F6F8] cursor-default border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {user.linkedin?.picture ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/api/proxy/linkedin-image?url=${encodeURIComponent(user.linkedin.picture)}`}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#0A66C2]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-[#0A66C2] rounded-full flex items-center justify-center text-white font-semibold text-base ${user.linkedin?.picture ? 'hidden' : ''}`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                          {user.linkedinProfileUrl && (
                            <p className="text-xs text-[#0A66C2]">
                              View LinkedIn Profile →
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
