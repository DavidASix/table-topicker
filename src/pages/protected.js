import auth from "@/middleware/auth";

export const getServerSideProps = async (context) => {
  let props = {};
  await auth(context.req, context.res);
  console.log(context.req.user._id);
  const userId = context.req.user._id || null;
  return {
    props: { userId: userId },
  };
};

function logout(userId) {
  //axios request to server to invalidate current JWT
  console.log("logout called");
}

export default function Protected(props) {
  const { userId } = props;
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 bg-slate-900`}
    >
      <h1 className="text-7xl text-white">This is a protected route</h1>
      {userId && (
        <>
          <span className="text-xl text-white">Welcome user {userId}</span>
          <a
            href={'/api/auth/logout'}
            className="bg-red-400 rounded-xl border h-20 min-w-52 flex justify-center items-center"
          >
            Logout
          </a>
        </>
      )}
      {!userId && (
        <div className="bg-red-400 rounded-xl border h-20 min-w-52 flex justify-center items-center">
          Login
        </div>
      )}
    </main>
  );
}
