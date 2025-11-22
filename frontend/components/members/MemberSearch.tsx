"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';

interface StudentType {
  id: number;
  name: string;
  studentId: string;
  email: string;
}

interface MemberSearchProps {
  onMemberSelect: (member: StudentType) => void;
  selectedMember?: StudentType | null;
}

export default function MemberSearch({ onMemberSelect, selectedMember }: MemberSearchProps) {
  const { members, loading, error } = useMembers();
  const [filteredMembers, setFilteredMembers] = useState<StudentType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter members based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.studentId.includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  const handleMemberSelect = (member: StudentType) => {
    onMemberSelect(member);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Member
      </label>

      {/* Selected member display / trigger */}
      <div
        className="w-full p-3 border border-gray-200 rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-blue-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {selectedMember ? (
            <>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {selectedMember.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-sm">{selectedMember.name}</div>
                <div className="text-xs text-gray-500">{selectedMember.studentId} • {selectedMember.email}</div>
              </div>
            </>
          ) : (
            <span className="text-gray-500">Select a member...</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Members list */}
          <div className="py-1">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading members...
              </div>
            ) : error ? (
              <div className="px-3 py-2 text-sm text-red-500 text-center">
                Error loading members
              </div>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                  onClick={() => handleMemberSelect(member)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.studentId} • {member.email}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No members found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
