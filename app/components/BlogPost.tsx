import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export interface BlogPostType {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  image: string;
  author: string;
}

interface BlogPostProps {
  post: BlogPostType;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader>
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={160}
          className="w-full h-40 object-cover object-center rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <h3 className="text-lg font-semibold mb-2 text-[#272A2B]">{post.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center text-xs text-gray-400">
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span>{post.author}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/blog/${post.slug}`} className="text-spring-green hover:underline font-medium">
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogPost;
