import Link from "next/link";
import Container from "~/components/Container";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { useState, useEffect } from "react";

const Stake = () => {
  const { address } = useAccount();
  const [disabled, setDisabled] = useState(true);

  const { handleSubmit } = useForm();

  const { data } = useContractRead({
    ...xenContract,
    functionName: "getUserStake",
    overrides: { from: address },
    watch: true,
  });

  const { config, error } = usePrepareContractWrite({
    ...xenContract,
    functionName: "withdraw",
  });
  const { write: writeStake } = useContractWrite(config);
  const handleStakeSubmit = () => {
    writeStake?.();
  };

  const utcTime = new Date().getTime() / 1000;

  useEffect(() => {
    if (
      address &&
      data &&
      !data.maturityTs.isZero() &&
      data.maturityTs < utcTime
    ) {
      setDisabled(false);
    }
  }, [address, utcTime, data]);

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">Start Stake</a>
          </Link>

          <Link href="/stake/2">
            <a className="step step-neutral">Staking</a>
          </Link>

          <Link href="/stake/3">
            <a className="step step-neutral">End Stake</a>
          </Link>
        </ul>
        <div className="card glass">
          <div className="card-body">
            <form onSubmit={handleSubmit(handleStakeSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">End Stake</h2>
                <button
                  type="submit"
                  className="btn glass text-neutral"
                  disabled={disabled}
                >
                  End Stake
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
